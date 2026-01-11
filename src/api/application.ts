import { axiosInstance } from './config';
import type { ApplicationRequestInterface, ApplicationResponseInterface } from '../utils/interface';

/**
 * Submit a job application
 * POST /api/applications
 */
export const ApplyJobAPI = async (
  application: ApplicationRequestInterface
): Promise<ApplicationResponseInterface | null> => {
  try {
    const response = await axiosInstance.post<ApplicationResponseInterface>(
      '/applications',
      application
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};
