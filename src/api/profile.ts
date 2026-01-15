import { axiosInstance } from "./config";
import type { UserProfileInterface } from '../utils/interface'

// Type for creating/updating profile (excludes backend-managed fields and email)
type UserProfileRequest = Omit<UserProfileInterface, 'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt'>;

// NOTE: POST PROFILE API
export const PostProfileAPI = async (req: UserProfileInterface): Promise<UserProfileInterface> => {
  try {
    // Exclude backend-managed fields and email
    const { id, userId, email, createdAt, updatedAt, ...profileRequest }: UserProfileInterface = req;
    const response = await axiosInstance.post<UserProfileInterface>('/profiles/me', profileRequest as UserProfileRequest);
    return response.data;
  } catch (error) {
    console.error('Error: Posting profile API', error);
    throw error
  }
}

// NOTE: PUT PROFILE API
export const PutProfileAPI = async (req: UserProfileInterface): Promise<UserProfileInterface> => {
  try {
    // Exclude backend-managed fields and email
    const { id, userId, email, createdAt, updatedAt, ...profileRequest }: UserProfileInterface = req;
    const response = await axiosInstance.put<UserProfileInterface>('/profiles/me', profileRequest as UserProfileRequest);
    return response.data;
  } catch (error) {
    console.error('Error: Putting profile API', error);
    throw error;
  }
}

// NOTE: GET PROFILE API
export const GetProfileAPI = async (): Promise<UserProfileInterface> => {
  try {
    const response = await axiosInstance.get('/profiles/me');
    return response.data;
  } catch (error) {
    console.error('Error: Getting profile API', error);
    throw error;
  }
}

// NOTE: GET USER PROFILE BY ID API (for viewing other users' profiles)
export const GetUserProfileByIdAPI = async (userId: string): Promise<UserProfileInterface> => {
  try {
    const response = await axiosInstance.get(`/profiles/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error: Getting user profile by ID', error);
    throw error;
  }
}

