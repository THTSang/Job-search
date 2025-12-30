import { axiosInstance } from './config';
import type { AuthResponse } from "../utils/interface";

const register = async (email: string, username: string, password: string, role: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/users', {
      email: email,
      name: username,
      password: password,
      role: role
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/users/sync', {
      email: email,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export { register, login };
