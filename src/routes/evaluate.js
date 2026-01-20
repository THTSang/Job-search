import { Router } from "express";
import multer from "multer";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import sessionStore from "../services/sessionStore.js";
import ai from "../services/aiEvaluator.js";
import { parseCv } from "../services/pdfParser.js";
import { schemas, validate } from "../middleware/validation.js";

const router = Router();

// Ensure uploads directory exists
const UPLOADS_DIR = "uploads";
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * Clean up uploaded file
 */
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to cleanup file ${filePath}:`, error.message);
  }
}

/**
 * POST /ai/evaluate/upload
 * Upload CV and create a new session
 */
router.post("/upload", upload.single("cv"), async (req, res) => {
  let filePath = req.file?.path;
  
  try {
    // Validate userId from form data
    const validation = schemas.upload.safeParse(req.body);
    if (!validation.success) {
      if (filePath) await cleanupFile(filePath);
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map(e => e.message).join(", "),
        code: "VALIDATION_ERROR",
      });
    }
    
    const { userId } = validation.data;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No PDF file uploaded. Use field name 'cv'",
      });
    }

    // Parse the CV
    const cvData = await parseCv(filePath);

    // Create session in memory
    const session = sessionStore.createSession(
      userId,
      cvData.raw,
      {
        contact: cvData.contact,
        summary: cvData.summary,
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
      },
      req.file.originalname,
      cvData.metadata.numPages
    );

    // Clean up uploaded file after parsing
    await cleanupFile(filePath);
    filePath = null;

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        userId: session.userId,
        filename: session.cvFilename,
        numPages: session.numPages,
        sections: {
          hasContact: !!cvData.contact,
          hasSummary: !!cvData.summary,
          hasExperience: !!cvData.experience,
          hasEducation: !!cvData.education,
          hasSkills: !!cvData.skills,
        },
        promptInfo: {
          used: 0,
          remaining: session.maxPrompts,
          max: session.maxPrompts,
        },
      },
    });
  } catch (error) {
    // Clean up file on error
    if (filePath) await cleanupFile(filePath);
    
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process CV",
    });
  }
});

/**
 * POST /ai/evaluate/chat
 * Send a message and get AI response
 */
router.post("/chat", validate(schemas.chat), async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;

    // Verify session exists and belongs to user
    const session = sessionStore.getSessionByUser(sessionId, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found or access denied",
        code: "SESSION_NOT_FOUND",
      });
    }

    // Check prompt limit before calling AI
    const limitCheck = sessionStore.checkPromptLimit(sessionId);
    if (!limitCheck.canPrompt) {
      return res.status(429).json({
        success: false,
        error: "Prompt limit reached",
        code: "PROMPT_LIMIT_REACHED",
        promptInfo: {
          used: limitCheck.used,
          remaining: limitCheck.remaining,
          max: limitCheck.max,
        },
      });
    }

    // Get AI response
    const result = await ai.chat(sessionId, message);

    res.json({
      success: true,
      data: {
        response: result.response,
        usage: result.usage,
        promptInfo: result.promptInfo,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);

    // Handle prompt limit error from AI service
    if (error.message === "PROMPT_LIMIT_REACHED") {
      const limitCheck = sessionStore.checkPromptLimit(req.body.sessionId);
      return res.status(429).json({
        success: false,
        error: "Prompt limit reached",
        code: "PROMPT_LIMIT_REACHED",
        promptInfo: {
          used: limitCheck.used,
          remaining: limitCheck.remaining,
          max: limitCheck.max,
        },
      });
    }

    // Handle rate limit from Groq API
    if (error.message === "GROQ_RATE_LIMIT") {
      return res.status(503).json({
        success: false,
        error: "AI service is temporarily unavailable. Please try again in a moment.",
        code: "GROQ_RATE_LIMIT",
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to get AI response",
    });
  }
});

/**
 * GET /ai/evaluate/:sessionId
 * Get session details and chat history
 */
router.get(
  "/:sessionId",
  validate(schemas.sessionIdParam, "params"),
  validate(schemas.queryUserId, "query"),
  (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.query;

      // Verify session exists and belongs to user
      const session = sessionStore.getSessionByUser(sessionId, userId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: "Session not found or access denied",
          code: "SESSION_NOT_FOUND",
        });
      }

      const stats = sessionStore.getSessionStats(sessionId);
      const chatHistory = sessionStore.getChatHistory(sessionId);

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          userId: session.userId,
          filename: session.cvFilename,
          numPages: session.numPages,
          sections: session.cvSections,
          createdAt: session.createdAt,
          promptInfo: {
            used: stats.promptsUsed,
            remaining: stats.promptsRemaining,
            max: stats.promptsMax,
          },
          messages: chatHistory.map((m) => ({
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
          })),
          messageCount: chatHistory.length,
        },
      });
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get session",
      });
    }
  }
);

/**
 * GET /ai/evaluate
 * List all sessions for a user
 */
router.get("/", validate(schemas.queryUserId, "query"), (req, res) => {
  try {
    const { userId } = req.query;
    const sessions = sessionStore.getSessionsByUser(userId);

    res.json({
      success: true,
      data: sessions.map((s) => {
        const stats = sessionStore.getSessionStats(s.id);
        return {
          sessionId: s.id,
          userId: s.userId,
          filename: s.cvFilename,
          numPages: s.numPages,
          createdAt: s.createdAt,
          promptInfo: {
            used: stats.promptsUsed,
            remaining: stats.promptsRemaining,
            max: stats.promptsMax,
          },
        };
      }),
    });
  } catch (error) {
    console.error("List sessions error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list sessions",
    });
  }
});

/**
 * DELETE /ai/evaluate/:sessionId
 * Delete a session
 */
router.delete(
  "/:sessionId",
  validate(schemas.sessionIdParam, "params"),
  validate(schemas.queryUserId, "query"),
  (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.query;

      const deleted = sessionStore.deleteSession(sessionId, userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Session not found or access denied",
          code: "SESSION_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "Session deleted successfully",
      });
    } catch (error) {
      console.error("Delete session error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete session",
      });
    }
  }
);

/**
 * POST /ai/evaluate/:sessionId/clear
 * Clear chat history and reset prompt count
 */
router.post(
  "/:sessionId/clear",
  validate(schemas.sessionIdParam, "params"),
  validate(schemas.clearSession),
  (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.body;

      const cleared = sessionStore.clearSession(sessionId, userId);
      if (!cleared) {
        return res.status(404).json({
          success: false,
          error: "Session not found or access denied",
          code: "SESSION_NOT_FOUND",
        });
      }

      const stats = sessionStore.getSessionStats(sessionId);

      res.json({
        success: true,
        message: "Chat history cleared and prompts reset",
        promptInfo: {
          used: stats.promptsUsed,
          remaining: stats.promptsRemaining,
          max: stats.promptsMax,
        },
      });
    } catch (error) {
      console.error("Clear session error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to clear session",
      });
    }
  }
);

export default router;
