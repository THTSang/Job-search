import { axiosInstance } from "./config";
import type { UserProfileInterface } from '../utils/interface'

// Type for creating/updating profile (excludes backend-managed fields)
type UserProfileRequest = Omit<UserProfileInterface, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

// NOTE: POST PROFILE API
export const PostProfileAPI = async (req: UserProfileInterface): Promise<UserProfileInterface> => {
  try {
    // Exclude backend-managed fields
    const { id, userId, createdAt, updatedAt, ...profileRequest }: UserProfileInterface = req;
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
    // Exclude backend-managed fields
    const { id, userId, createdAt, updatedAt, ...profileRequest }: UserProfileInterface = req;
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

