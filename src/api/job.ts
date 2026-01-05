import { axiosInstance } from './config';
import type { JobData, JobPostRequest } from '../utils/interface';


// NOTE: POST JOB API
export const PostJobAPI = async (jobInfo: JobPostRequest): Promise<JobData | null> => {
  try {
    const response = await axiosInstance.post('/jobs', jobInfo);
    return response.data;
  } catch (error) {
    console.error('Error: Post job API', error);
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

