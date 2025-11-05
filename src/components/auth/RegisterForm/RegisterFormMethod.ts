import axios, { AxiosError } from 'axios';

export interface RegisterFormData {
  email: string;
  name: string;
  password: string;
  roles: string[];
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
export async function registerUser(formData: RegisterFormData): Promise<RegisterResponse> {
  try {
    const response = await axios.post<RegisterResponse>('/api/users', {
      ...formData,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message ||
        axiosError.message ||
        'Registration failed';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred during registration');
  }
}
