import { axiosInstance } from './config';
import type { AuthResponse, AuthToken } from "../utils/interface";

// NOTE: SignUpAPI

export const SignUpAPI = async (email: string, username: string, password: string, role: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/users', {
      email: email,
      name: username,
      password: password,
      role: role
    });
    return response.data;
  } catch (error) {
    console.error("Registration API failed:", error);
    throw error;
  }
};

// NOTE: Login API
export const LoginAPI = async (email: string, password: string): Promise<AuthToken> => {
  try {
    const response = await axiosInstance.post('/users/login', {
      email: email,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error('Login API failed:', error);
    throw error;
  }
};

// NOTE: BasicUserInfoAPI
export const BasicUserInfoAPI = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;

  } catch (error) {
    console.error('Error getting basic user info', error);
    throw error;
  }
}

// NOTE: ForgotPasswordAPI
export const ForgotPasswordAPI = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/users/forgot-password', {
      email: email
    });
    return response.data;
  } catch (error) {
    console.error('Forgot password API failed:', error);
    throw error;
  }
};

// NOTE: ResetPasswordAPI
export const ResetPasswordAPI = async (token: string, newPassword: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/users/reset-password', {
      token: token,
      newPassword: newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Reset password API failed:', error);
    throw error;
  }
};

// NOTE: VerifyEmailAPI
export const VerifyEmailAPI = async (token: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.get('/users/verify', {
      params: { token }
    });
    return response.data;
  } catch (error) {
    console.error('Verify email API failed:', error);
    throw error;
  }
};


