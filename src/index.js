import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import evaluateRoutes from "./routes/evaluate.js";
import sessionStore from "./services/sessionStore.js";
import requestLogger from "./middleware/logger.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Request logging
app.use(requestLogger);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// Middleware
app.use(express.json());
app.use(express.raw({ type: "application/pdf", limit: "10mb" }));

// Routes
app.use("/ai/evaluate", evaluateRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "CV Evaluation API",
    version: "2.0.0",
    description: "AI-powered CV evaluation with chat interface",
    limits: {
      maxPromptsPerSession: sessionStore.CONFIG.maxPrompts,
      note: "Sessions are stored in memory and cleared on server restart or page reload",
    },
    endpoints: {
      health: "GET /health",
      uploadCv: "POST /ai/evaluate/upload",
      chat: "POST /ai/evaluate/chat",
      evaluateJob: "POST /ai/evaluate/job",
      getSession: "GET /ai/evaluate/:sessionId",
      listSessions: "GET /ai/evaluate",
      deleteSession: "DELETE /ai/evaluate/:sessionId",
      clearChat: "POST /ai/evaluate/:sessionId/clear",
    },
    usage: {
      step1: "Upload CV: POST /ai/evaluate/upload with 'cv' file and 'userId'",
      step2: "Chat: POST /ai/evaluate/chat with { userId, sessionId, message }",
      step3: "Check promptInfo in response to show remaining prompts to user",
    },
    promptLimitResponse: {
      note: "When limit is reached, API returns 429 status with code PROMPT_LIMIT_REACHED",
      example: {
        success: false,
        error: "Prompt limit reached",
        code: "PROMPT_LIMIT_REACHED",
        promptInfo: { used: 10, remaining: 0, max: 10 },
      },
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File size exceeds the 10MB limit",
    });
  }

  if (error.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

// Cleanup expired sessions periodically (every 10 minutes)
setInterval(() => {
  sessionStore.cleanupExpiredSessions();
}, 10 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`\nCV Evaluation API running on http://localhost:${PORT}`);
  console.log(`\nLimits: ${sessionStore.CONFIG.maxPrompts} prompts per session`);
  console.log("\nEndpoints:");
  console.log(`  Health:     GET  http://localhost:${PORT}/health`);
  console.log(`  Upload CV:  POST http://localhost:${PORT}/ai/evaluate/upload`);
  console.log(`  Chat:       POST http://localhost:${PORT}/ai/evaluate/chat`);
  console.log(`  Sessions:   GET  http://localhost:${PORT}/ai/evaluate`);
  console.log("\nMake sure GROQ_API_KEY is set in your .env file");
});
