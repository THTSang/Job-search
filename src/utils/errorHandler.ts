/**
 * Error handling utilities for user-friendly error messages
 * 
 * This module provides functions to convert technical errors into
 * user-friendly Vietnamese messages.
 */

// Common HTTP status code to user-friendly message mapping
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
  401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy thông tin yêu cầu.',
  409: 'Thao tác bị trùng lặp. Dữ liệu đã tồn tại.',
  422: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
  500: 'Lỗi hệ thống. Vui lòng thử lại sau.',
  502: 'Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau.',
  503: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
  504: 'Máy chủ không phản hồi. Vui lòng thử lại sau.',
};

// Default error message
const DEFAULT_ERROR_MESSAGE = 'Có lỗi xảy ra. Vui lòng thử lại sau.';

// Network error message
const NETWORK_ERROR_MESSAGE = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';

/**
 * Type for Axios-like error structure
 */
interface AxiosLikeError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      code?: string;
    };
  };
  code?: string;
  message?: string;
}

/**
 * Check if the error is an Axios-like error with response
 */
function isAxiosError(error: unknown): error is AxiosLikeError {
  return error !== null && typeof error === 'object' && 'response' in error;
}

/**
 * Check if the error is a network error (no response from server)
 */
function isNetworkError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  
  // Axios sets code to 'ERR_NETWORK' for network errors
  if (error.code === 'ERR_NETWORK') return true;
  
  // No response object means network error
  if (!error.response) return true;
  
  return false;
}

/**
 * Get HTTP status code from error
 */
function getStatusCode(error: unknown): number | null {
  if (!isAxiosError(error)) return null;
  return error.response?.status ?? null;
}

/**
 * Convert any error to a user-friendly message in Vietnamese
 * 
 * @param error - The error object (usually from axios catch block)
 * @param fallbackMessage - Optional custom fallback message
 * @returns User-friendly error message in Vietnamese
 * 
 * @example
 * try {
 *   await someAPI();
 * } catch (error) {
 *   setErrorMessage(getUserFriendlyMessage(error));
 * }
 */
export function getUserFriendlyMessage(error: unknown, fallbackMessage?: string): string {
  // Network error - no server response
  if (isNetworkError(error)) {
    return NETWORK_ERROR_MESSAGE;
  }
  
  // Get status code and return mapped message
  const statusCode = getStatusCode(error);
  if (statusCode && HTTP_ERROR_MESSAGES[statusCode]) {
    return HTTP_ERROR_MESSAGES[statusCode];
  }
  
  // Return custom fallback or default message
  return fallbackMessage ?? DEFAULT_ERROR_MESSAGE;
}

/**
 * Get user-friendly message for specific HTTP status codes
 * Useful when you want to handle specific status codes differently
 * 
 * @param statusCode - HTTP status code
 * @returns User-friendly message or null if not found
 */
export function getMessageByStatusCode(statusCode: number): string | null {
  return HTTP_ERROR_MESSAGES[statusCode] ?? null;
}

/**
 * Check if error matches a specific HTTP status code
 * 
 * @param error - The error object
 * @param statusCode - The status code to check
 * @returns boolean
 * 
 * @example
 * if (isStatusCode(error, 409)) {
 *   setError('Bạn đã ứng tuyển công việc này rồi');
 * }
 */
export function isStatusCode(error: unknown, statusCode: number): boolean {
  return getStatusCode(error) === statusCode;
}

/**
 * Log error to console in development mode only
 * In production, you might want to send to a monitoring service
 * 
 * @param context - Description of where the error occurred
 * @param error - The error object
 */
export function logError(context: string, error: unknown): void {
  // Always log in development
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  
  // In production, you could send to error monitoring service
  // Example: Sentry, LogRocket, etc.
  // if (import.meta.env.PROD) {
  //   sendToMonitoringService(context, error);
  // }
}

/**
 * Create a custom error handler for specific use cases
 * 
 * @param customMessages - Custom status code to message mapping
 * @returns Function that converts error to user-friendly message
 * 
 * @example
 * const handleApplyError = createErrorHandler({
 *   409: 'Bạn đã ứng tuyển công việc này rồi',
 *   401: 'Vui lòng đăng nhập để ứng tuyển',
 * });
 * 
 * try {
 *   await applyJob();
 * } catch (error) {
 *   setError(handleApplyError(error));
 * }
 */
export function createErrorHandler(
  customMessages: Record<number, string>
): (error: unknown) => string {
  return (error: unknown): string => {
    // Check network error first
    if (isNetworkError(error)) {
      return NETWORK_ERROR_MESSAGE;
    }
    
    // Check custom messages first
    const statusCode = getStatusCode(error);
    if (statusCode && customMessages[statusCode]) {
      return customMessages[statusCode];
    }
    
    // Fall back to default handler
    return getUserFriendlyMessage(error);
  };
}

// Export types for use in other modules
export type { AxiosLikeError };
