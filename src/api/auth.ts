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


