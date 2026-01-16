import axios from 'axios';
import type { 
  AIEvaluateResponse, 
  AIUploadResponse, 
  AIChatHistoryResponse, 
  AISessionListResponse 
} from '../utils/interface';

// Create separate axios instance for AI service (different base URL)
// Production: Vercel deployment, Development: localhost
const AI_BASE_URL = import.meta.env.PROD
  ? 'https://cv-evaluation-43wa1i1ph-infinitevoidloops-projects.vercel.app'
  : 'http://localhost:3000';

const aiAxiosInstance = axios.create({
  baseURL: AI_BASE_URL,
});

/**
 * Upload CV for AI evaluation
 * @param file - CV file (PDF/DOCX)
 * @param userId - User ID from auth
 * @returns Session ID and initial response
 */
export const UploadCVAPI = async (file: File, userId: string): Promise<AIUploadResponse> => {
  const formData = new FormData();
  formData.append('cv', file);
  formData.append('userId', userId);

  const response = await aiAxiosInstance.post<AIUploadResponse>(
    '/ai/evaluate/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Send chat message to AI
 * @param userId - User ID
 * @param sessionId - Session ID from upload
 * @param message - User message
 * @returns AI response in Markdown format
 */
export const ChatAPI = async (
  userId: string, 
  sessionId: string, 
  message: string
): Promise<AIEvaluateResponse> => {
  const response = await aiAxiosInstance.post<AIEvaluateResponse>(
    '/ai/evaluate/chat',
    { userId, sessionId, message }
  );
  return response.data;
};

/**
 * Match CV against job description
 * @param userId - User ID
 * @param sessionId - Session ID from upload
 * @param jobDescription - Job description text
 * @returns AI analysis of CV-job match
 */
export const MatchJobAPI = async (
  userId: string, 
  sessionId: string, 
  jobDescription: string
): Promise<AIEvaluateResponse> => {
  const response = await aiAxiosInstance.post<AIEvaluateResponse>(
    '/ai/evaluate/job',
    { userId, sessionId, jobDescription }
  );
  return response.data;
};

/**
 * Get chat history for a session
 * @param sessionId - Session ID
 * @param userId - User ID
 * @returns Chat history
 */
export const GetChatHistoryAPI = async (
  sessionId: string, 
  userId: string
): Promise<AIChatHistoryResponse> => {
  const response = await aiAxiosInstance.get<AIChatHistoryResponse>(
    `/ai/evaluate/${sessionId}`,
    { params: { userId } }
  );
  return response.data;
};

/**
 * List all sessions for a user
 * @param userId - User ID
 * @returns List of sessions
 */
export const ListSessionsAPI = async (userId: string): Promise<AISessionListResponse> => {
  const response = await aiAxiosInstance.get<AISessionListResponse>(
    '/ai/evaluate',
    { params: { userId } }
  );
  return response.data;
};

/**
 * Clear chat history for a session
 * @param sessionId - Session ID
 * @param userId - User ID
 */
export const ClearChatAPI = async (sessionId: string, userId: string): Promise<void> => {
  await aiAxiosInstance.post(`/ai/evaluate/${sessionId}/clear`, { userId });
};

/**
 * Delete a session
 * @param sessionId - Session ID
 * @param userId - User ID
 */
export const DeleteSessionAPI = async (sessionId: string, userId: string): Promise<void> => {
  await aiAxiosInstance.delete(`/ai/evaluate/${sessionId}`, { params: { userId } });
};
