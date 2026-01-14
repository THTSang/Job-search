import { axiosInstance } from './config';
import type { 
  ChatStartRequest, 
  ChatStartResponse, 
  ChatMessage, 
  ChatConversation,
  PageResponse,
  ChatUserSearchResult
} from '../utils/interface';

/**
 * Start a new chat conversation with a recipient
 * POST /api/chat/start
 * @param recipientId - The ID of the user to chat with
 * @returns Chat info with chatId, partnerId, partnerName
 */
export const StartChatAPI = async (recipientId: string): Promise<ChatStartResponse> => {
  const request: ChatStartRequest = { recipientId };
  const response = await axiosInstance.post<ChatStartResponse>('/chat/start', request);
  return response.data;
};

/**
 * Get messages with a specific recipient (paginated)
 * GET /api/chat/{recipientId}
 * @param recipientId - The ID of the chat partner
 * @param page - Page number (0-based)
 * @param size - Number of messages per page
 * @returns Paginated list of messages
 */
export const GetChatMessagesAPI = async (
  recipientId: string,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<ChatMessage>> => {
  const response = await axiosInstance.get<PageResponse<ChatMessage>>(
    `/chat/${recipientId}`,
    {
      params: { page, size }
    }
  );
  return response.data;
};

/**
 * Get all conversations for the current user (paginated)
 * GET /api/chat/conversations
 * @param page - Page number (0-based)
 * @param size - Number of conversations per page
 * @returns Paginated list of conversations
 */
export const GetConversationsAPI = async (
  page: number = 0,
  size: number = 20
): Promise<PageResponse<ChatConversation>> => {
  const response = await axiosInstance.get<PageResponse<ChatConversation>>(
    '/chat/conversations',
    {
      params: { page, size }
    }
  );
  return response.data;
};

/**
 * Search for users to start a chat with
 * GET /api/chat/users/search
 * @param query - Search query (name or email)
 * @param page - Page number (0-based)
 * @param size - Number of results per page
 * @returns Paginated list of users matching the query
 */
export const SearchChatUsersAPI = async (
  query: string,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<ChatUserSearchResult>> => {
  const response = await axiosInstance.get<PageResponse<ChatUserSearchResult>>(
    '/chat/users/search',
    {
      params: { 
        query,
        'pageable.page': page,
        'pageable.size': size
      }
    }
  );
  return response.data;
};

/**
 * Send a chat message to a recipient
 * POST /api/chat/send
 * @param recipientId - The ID of the user to send message to
 * @param content - The message content
 * @returns The sent message
 */
export const SendMessageAPI = async (
  recipientId: string,
  content: string
): Promise<ChatMessage> => {
  const response = await axiosInstance.post<ChatMessage>('/chat/send', {
    recipientId,
    content
  });
  return response.data;
};
