import { v4 as uuidv4 } from "uuid";

// Configuration
const CONFIG = {
  maxPrompts: 10, // Maximum prompts per session
  sessionTimeout: 60 * 60 * 1000, // 1 hour in milliseconds
};

// In-memory session store
const sessions = new Map();

/**
 * Create a new session
 * @param {string} userId - User identifier
 * @param {string} cvText - Parsed CV text
 * @param {Object} cvSections - Extracted CV sections
 * @param {string} cvFilename - Original filename
 * @param {number} numPages - Number of pages in PDF
 * @returns {Object} Session data with sessionId
 */
export function createSession(userId, cvText, cvSections, cvFilename, numPages) {
  const sessionId = uuidv4();
  
  const session = {
    id: sessionId,
    userId,
    cvText,
    cvSections,
    cvFilename,
    numPages,
    chatHistory: [],
    promptCount: 0,
    maxPrompts: CONFIG.maxPrompts,
    createdAt: new Date().toISOString(),
  };

  sessions.set(sessionId, session);
  
  return session;
}

/**
 * Get session by ID
 * @param {string} sessionId
 * @returns {Object|null} Session data or null
 */
export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Get session by ID and validate user ownership
 * @param {string} sessionId
 * @param {string} userId
 * @returns {Object|null} Session data or null
 */
export function getSessionByUser(sessionId, userId) {
  const session = sessions.get(sessionId);
  if (session && session.userId === userId) {
    return session;
  }
  return null;
}

/**
 * Get all sessions for a user
 * @param {string} userId
 * @returns {Array} Array of sessions
 */
export function getSessionsByUser(userId) {
  const userSessions = [];
  for (const session of sessions.values()) {
    if (session.userId === userId) {
      userSessions.push(session);
    }
  }
  return userSessions;
}

/**
 * Check if session can send more prompts
 * @param {string} sessionId
 * @returns {Object} { canPrompt, remaining, used, max }
 */
export function checkPromptLimit(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    return { canPrompt: false, remaining: 0, used: 0, max: CONFIG.maxPrompts };
  }

  const remaining = CONFIG.maxPrompts - session.promptCount;
  return {
    canPrompt: remaining > 0,
    remaining,
    used: session.promptCount,
    max: CONFIG.maxPrompts,
  };
}

/**
 * Add a message to chat history and increment prompt count (for user messages)
 * @param {string} sessionId
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content
 * @returns {Object|null} Updated prompt info or null if limit reached
 */
export function addMessage(sessionId, role, content) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  // Check limit before adding user message
  if (role === "user") {
    if (session.promptCount >= CONFIG.maxPrompts) {
      return null; // Limit reached
    }
    session.promptCount++;
  }

  session.chatHistory.push({
    role,
    content,
    createdAt: new Date().toISOString(),
  });

  return {
    remaining: CONFIG.maxPrompts - session.promptCount,
    used: session.promptCount,
    max: CONFIG.maxPrompts,
  };
}

/**
 * Get chat history for a session
 * @param {string} sessionId
 * @returns {Array} Chat history
 */
export function getChatHistory(sessionId) {
  const session = sessions.get(sessionId);
  return session ? session.chatHistory : [];
}

/**
 * Delete a session
 * @param {string} sessionId
 * @param {string} userId
 * @returns {boolean} True if deleted
 */
export function deleteSession(sessionId, userId) {
  const session = sessions.get(sessionId);
  if (session && session.userId === userId) {
    sessions.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * Clear chat history for a session (reset prompts)
 * @param {string} sessionId
 * @param {string} userId
 * @returns {boolean} True if cleared
 */
export function clearSession(sessionId, userId) {
  const session = sessions.get(sessionId);
  if (session && session.userId === userId) {
    session.chatHistory = [];
    session.promptCount = 0;
    return true;
  }
  return false;
}

/**
 * Get session stats for frontend
 * @param {string} sessionId
 * @returns {Object|null} Session stats
 */
export function getSessionStats(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  return {
    sessionId: session.id,
    userId: session.userId,
    filename: session.cvFilename,
    numPages: session.numPages,
    promptsUsed: session.promptCount,
    promptsRemaining: CONFIG.maxPrompts - session.promptCount,
    promptsMax: CONFIG.maxPrompts,
    messageCount: session.chatHistory.length,
    createdAt: session.createdAt,
  };
}

/**
 * Clean up expired sessions (optional, call periodically)
 */
export function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    const createdAt = new Date(session.createdAt).getTime();
    if (now - createdAt > CONFIG.sessionTimeout) {
      sessions.delete(sessionId);
    }
  }
}

export default {
  createSession,
  getSession,
  getSessionByUser,
  getSessionsByUser,
  checkPromptLimit,
  addMessage,
  getChatHistory,
  deleteSession,
  clearSession,
  getSessionStats,
  cleanupExpiredSessions,
  CONFIG,
};
