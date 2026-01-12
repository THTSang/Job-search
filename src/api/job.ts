import { axiosInstance } from './config';
import type { JobData, JobPostRequest, JobUpdateRequest, PageResponse, JobSearchRequest, JobSearchPageable } from '../utils/interface';


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

// NOTE: SEARCH JOBS API (with pagination and filters)
// Endpoint: GET /api/jobs/search
export const SearchJobsAPI = async (
  request: JobSearchRequest = {},
  pageable: JobSearchPageable = { page: 0, size: 10 }
): Promise<PageResponse<JobData> | null> => {
  try {
    // Build query params - only include non-empty values
    const params: Record<string, string | number> = {
      page: pageable.page,
      size: pageable.size
    };

    // Add sort if provided
    if (pageable.sort && pageable.sort.length > 0) {
      params.sort = pageable.sort.join(',');
    }

    // Add search filters - only non-empty values
    if (request.keyword && request.keyword.trim()) {
      params.keyword = request.keyword.trim();
    }
    if (request.locationCity && request.locationCity.trim()) {
      params.locationCity = request.locationCity.trim();
    }
    if (request.categoryName && request.categoryName.trim()) {
      params.categoryName = request.categoryName.trim();
    }
    if (request.minSalary !== undefined && request.minSalary > 0) {
      params.minSalary = request.minSalary;
    }
    if (request.maxSalary !== undefined && request.maxSalary > 0) {
      params.maxSalary = request.maxSalary;
    }
    if (request.minExperience !== undefined && request.minExperience >= 0) {
      params.minExperience = request.minExperience;
    }
    if (request.jobType) {
      params.jobType = request.jobType;
    }
    if (request.status) {
      params.status = request.status;
    }

    const response = await axiosInstance.get('/jobs/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error: Searching jobs API', error);
    throw error;
  }
};

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
};

// NOTE: GET JOB BY ID API
// Endpoint: GET /api/jobs/{id}
export const GetJobByIdAPI = async (jobId: string): Promise<JobData | null> => {
  try {
    const response = await axiosInstance.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error: Fetching job by ID', error);
    throw error;
  }
};

// NOTE: DELETE JOB API
// Endpoint: DELETE /api/jobs/{id}
export const DeleteJobAPI = async (jobId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/jobs/${jobId}`);
  } catch (error) {
    console.error('Error: Deleting job', error);
    throw error;
  }
};

// NOTE: UPDATE JOB API
// Endpoint: PUT /api/jobs/{id}
export const UpdateJobAPI = async (jobId: string, jobData: JobUpdateRequest): Promise<JobData | null> => {
  try {
    const response = await axiosInstance.put(`/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error: Updating job', error);
    throw error;
  }
};
