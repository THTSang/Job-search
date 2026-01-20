/**
 * Error handling utilities for user-friendly error messages
 * Converts technical errors into user-friendly Vietnamese messages.
 */

// HTTP status code to Vietnamese message mapping
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

const DEFAULT_ERROR_MESSAGE = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
const NETWORK_ERROR_MESSAGE = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';

// Axios-like error structure
interface AxiosLikeError {
  response?: {
    status?: number;
    data?: { message?: string; code?: string };
  };
  code?: string;
  message?: string;
}

function isAxiosError(error: unknown): error is AxiosLikeError {
  return error !== null && typeof error === 'object' && 'response' in error;
}

function isNetworkError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return error.code === 'ERR_NETWORK' || !error.response;
}

function getStatusCode(error: unknown): number | null {
  if (!isAxiosError(error)) return null;
  return error.response?.status ?? null;
}

/**
 * Convert any error to a user-friendly message in Vietnamese
 */
export function getUserFriendlyMessage(error: unknown, fallbackMessage?: string): string {
  if (isNetworkError(error)) {
    return NETWORK_ERROR_MESSAGE;
  }

  const statusCode = getStatusCode(error);
  if (statusCode && HTTP_ERROR_MESSAGES[statusCode]) {
    return HTTP_ERROR_MESSAGES[statusCode];
  }

  return fallbackMessage ?? DEFAULT_ERROR_MESSAGE;
}

/**
 * Log error to console in development mode only
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

/**
 * Create a custom error handler for specific use cases
 */
export function createErrorHandler(
  customMessages: Record<number, string>
): (error: unknown) => string {
  return (error: unknown): string => {
    if (isNetworkError(error)) {
      return NETWORK_ERROR_MESSAGE;
    }

    const statusCode = getStatusCode(error);
    if (statusCode && customMessages[statusCode]) {
      return customMessages[statusCode];
    }

    return getUserFriendlyMessage(error);
  };
}

export type { AxiosLikeError };
