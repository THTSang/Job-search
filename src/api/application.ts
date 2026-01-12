import { axiosInstance } from './config';
import type { 
  ApplicationRequestInterface, 
  ApplicationResponseInterface,
  ApplicationStatsInterface,
  JobApplicationInterface,
  PageResponse,
  JobSearchPageable
} from '../utils/interface';

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

/**
 * Get current user's applications with pagination
 * GET /api/applications/me
 */
export const GetMyApplicationsAPI = async (
  pageable: JobSearchPageable
): Promise<PageResponse<ApplicationResponseInterface> | null> => {
  try {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sortParam => {
        params.append('sort', sortParam);
      });
    }

    const response = await axiosInstance.get<PageResponse<ApplicationResponseInterface>>(
      `/applications/me?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

/**
 * Get current user's application statistics
 * GET /api/applications/me/stats
 */
export const GetApplicationStatsAPI = async (): Promise<ApplicationStatsInterface | null> => {
  try {
    const response = await axiosInstance.get<ApplicationStatsInterface>(
      '/applications/me/stats'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching application stats:', error);
    throw error;
  }
};

/**
 * Get applications for a specific job (employer view)
 * GET /api/applications/job/{jobId}
 */
export const GetJobApplicationsAPI = async (
  jobId: string,
  pageable: JobSearchPageable = { page: 0, size: 10 }
): Promise<PageResponse<JobApplicationInterface> | null> => {
  try {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sortParam => {
        params.append('sort', sortParam);
      });
    }

    const response = await axiosInstance.get<PageResponse<JobApplicationInterface>>(
      `/applications/job/${jobId}?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};
