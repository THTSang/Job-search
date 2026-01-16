import Groq from "groq-sdk";
import sessionStore from "./sessionStore.js";

// Lazy initialization of Groq client
let groq = null;

function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is not set. Please add it to your .env file."
      );
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

// Configuration
const CONFIG = {
  model: "llama-3.3-70b-versatile", // Current best model on Groq
  maxTokens: 2000,
  temperature: 0.7,
  maxRetries: 3,
  retryDelayMs: 2000, // 2 seconds (Groq is faster, shorter delays)
};

// System prompt for CV evaluation (Vietnamese)
const SYSTEM_PROMPT = `Bạn là một chuyên gia đánh giá CV/Hồ sơ xin việc và tư vấn nghề nghiệp. Vai trò của bạn là giúp người dùng cải thiện CV và chuẩn bị cho việc ứng tuyển.

Khi đánh giá CV, bạn cần xem xét:

1. **Điểm tổng thể** (0-100): Đưa ra điểm chất lượng tổng thể
2. **Chất lượng nội dung**:
   - Độ rõ ràng và súc tích của các mô tả
   - Sử dụng động từ hành động và thành tích có thể đo lường
   - Tính liên quan của thông tin
3. **Phần kỹ năng**:
   - Mức độ phù hợp với ngành nghề mục tiêu
   - Cân bằng giữa kỹ năng chuyên môn và kỹ năng mềm
   - Các kỹ năng quan trọng còn thiếu
4. **Phần kinh nghiệm**:
   - Chức danh và thời gian rõ ràng
   - Mô tả tập trung vào thành tích
   - Sự phát triển trong sự nghiệp
5. **Học vấn**:
   - Định dạng phù hợp
   - Các chứng chỉ liên quan
6. **Tương thích ATS**:
   - Tối ưu hóa từ khóa
   - Định dạng hoạt động tốt với Hệ thống theo dõi ứng viên (ATS)
7. **Định dạng & Trình bày**:
   - Vẻ ngoài chuyên nghiệp
   - Định dạng nhất quán
   - Độ dài phù hợp

Khi người dùng đặt câu hỏi:
- Cung cấp phản hồi cụ thể và có thể thực hiện được
- Đưa ra ví dụ khi đề xuất cải thiện
- Khuyến khích nhưng thành thật về những điểm cần cải thiện
- Nếu có mô tả công việc, đánh giá mức độ phù hợp của CV với yêu cầu

Luôn trình bày câu trả lời rõ ràng với tiêu đề và gạch đầu dòng khi cần thiết.
Trả lời bằng tiếng Việt.`;

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry(fn, maxRetries = CONFIG.maxRetries) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if it's a rate limit error (429)
      const isRateLimit = error.status === 429 || 
        error.message?.includes("429") ||
        error.message?.includes("rate_limit") ||
        error.message?.includes("Too Many Requests");

      if (isRateLimit && attempt < maxRetries) {
        // Calculate delay with exponential backoff
        const delay = CONFIG.retryDelayMs * attempt;
        console.log(`Rate limit hit. Retrying in ${delay / 1000}s... (attempt ${attempt}/${maxRetries})`);
        await sleep(delay);
        continue;
      }

      // If not a rate limit error or max retries reached, throw
      throw error;
    }
  }

  // If we exhausted retries due to rate limiting, throw specific error
  const isRateLimit = lastError.status === 429 || 
    lastError.message?.includes("429") ||
    lastError.message?.includes("rate_limit") ||
    lastError.message?.includes("Too Many Requests");
  
  if (isRateLimit) {
    console.error("Groq rate limit: Max retries exhausted");
    throw new Error("GROQ_RATE_LIMIT");
  }

  throw lastError;
}

/**
 * Build chat messages for Groq API
 */
function buildMessages(session, chatHistory, userMessage) {
  const messages = [];

  // System message with CV context
  const systemContent = `${SYSTEM_PROMPT}

---

The user has uploaded a CV with the following content:

**Filename:** ${session.cvFilename}
**Pages:** ${session.numPages}

**CV Content:**
${session.cvText}

**Extracted Sections:**
${formatSections(session.cvSections)}

---

Please help the user with their CV-related questions.`;

  messages.push({
    role: "system",
    content: systemContent,
  });

  // Add chat history
  for (const msg of chatHistory) {
    messages.push({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    });
  }

  // Add current user message
  messages.push({
    role: "user",
    content: userMessage,
  });

  return messages;
}

/**
 * Format CV sections for display
 */
function formatSections(sections) {
  if (!sections || Object.keys(sections).length === 0) {
    return "No structured sections detected.";
  }

  const formatted = [];
  const sectionNames = ["contact", "summary", "experience", "education", "skills"];

  for (const name of sectionNames) {
    if (sections[name]) {
      formatted.push(`**${name.charAt(0).toUpperCase() + name.slice(1)}:**\n${sections[name]}`);
    }
  }

  return formatted.join("\n\n") || "No structured sections detected.";
}

/**
 * Chat with the AI about a CV
 * @param {string} sessionId
 * @param {string} userMessage
 * @returns {Object} { response, usage, promptInfo }
 */
export async function chat(sessionId, userMessage) {
  // Get session
  const session = sessionStore.getSession(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  // Check prompt limit
  const limitCheck = sessionStore.checkPromptLimit(sessionId);
  if (!limitCheck.canPrompt) {
    throw new Error("PROMPT_LIMIT_REACHED");
  }

  // Get Groq client
  const client = getGroqClient();

  // Get current chat history
  const chatHistory = sessionStore.getChatHistory(sessionId);

  // Build messages for Groq
  const messages = buildMessages(session, chatHistory, userMessage);

  // Send message with retry logic
  const completion = await withRetry(async () => {
    return await client.chat.completions.create({
      model: CONFIG.model,
      messages: messages,
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
    });
  });

  const assistantMessage = completion.choices[0]?.message?.content || "";

  // Save messages to session store
  sessionStore.addMessage(sessionId, "user", userMessage);
  sessionStore.addMessage(sessionId, "assistant", assistantMessage);

  // Get updated prompt info
  const promptInfo = sessionStore.checkPromptLimit(sessionId);

  // Get token usage
  const usage = completion.usage || {};

  return {
    response: assistantMessage,
    usage: {
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
      totalTokens: usage.total_tokens || 0,
    },
    promptInfo: {
      used: promptInfo.used,
      remaining: promptInfo.remaining,
      max: promptInfo.max,
    },
  };
}

/**
 * Get initial evaluation of CV
 */
export async function getInitialEvaluation(sessionId, jobDescription = null) {
  let prompt = "Vui lòng đánh giá toàn diện CV của tôi. Bao gồm điểm tổng thể, điểm mạnh, điểm yếu và các đề xuất cải thiện cụ thể.";

  if (jobDescription) {
    prompt += `\n\nTôi đang ứng tuyển vào vị trí sau:\n${jobDescription}\n\nVui lòng đánh giá mức độ phù hợp của CV với mô tả công việc này và những gì tôi nên nhấn mạnh hoặc cải thiện.`;
  }

  return chat(sessionId, prompt);
}

/**
 * Evaluate CV match against a job description
 */
export async function evaluateJobMatch(sessionId, jobDescription) {
  const prompt = `Vui lòng đánh giá mức độ phù hợp của CV với mô tả công việc sau.
Cung cấp:
1. Điểm phù hợp (0-100)
2. Các yêu cầu đã đáp ứng
3. Các yêu cầu còn thiếu
4. Đề xuất để điều chỉnh CV cho vị trí này

Mô tả công việc:
${jobDescription}`;

  return chat(sessionId, prompt);
}

export default {
  chat,
  getInitialEvaluation,
  evaluateJobMatch,
  CONFIG,
};
