import { axiosInstance } from './config';
import type { JobData } from '../utils/interface';

const jobList = async (): Promise<JobData[] | null> => {
  try {
    const response = await axiosInstance.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Fetching job list failed:', error);
    throw error;
  }
};

export { jobList };

