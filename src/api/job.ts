import { axiosInstance } from './config';
import type { JobData, JobPostRequest, PageResponse } from '../utils/interface';


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

// NOTE: GET JOB API GIVING PAGE, SIZE = 10
export const GetJobListAPI = async (_pagenumber: number): Promise<JobData[] | null> => {
  try {
    const response = await axiosInstance.get('/jobs/search');
    return response.data;
  } catch (error) {
    console.error('Error: Fetching job API', error);
    throw error
  }
}

// NOTE: GET COMPANY POSTED JOBS API (with pagination)
// Endpoint: GET /api/companies/{id}/jobs
export const GetCompanyJobsAPI = async (
  companyId: string,
  page: number = 0,
  size: number = 5
): Promise<PageResponse<JobData> | null> => {
  try {
    const response = await axiosInstance.get(`/companies/${companyId}/jobs`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error: Fetching company jobs', error);
    throw error;
  }
}
