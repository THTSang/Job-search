import { axiosInstance } from './config';
import type { JobData } from '../utils/interface';


// NOTE: POST JOB API
export const PostJobAPI = async (JobInfo: JobData): Promise<JobData[] | null> => {
  try {
    const response = await axiosInstance.post('/jobs', JobInfo);
    return response.data;
  } catch (error) {
    console.error('Fetching job list failed:', error);
    throw error;
  }
};

// NOTE: GET JOB API
export const GetJobListAPI = async (): Promise<JobData[] | null> => {
  try {
    const response = await axiosInstance.get('/jobs/search');
    return response.data;
  } catch (error) {
    console.error('Error: Fetching job API', error);
    throw error
  }
}

