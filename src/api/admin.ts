import { axiosInstance } from './config';
import type { 
  AdminUserInterface, 
  UpdateUserStatusRequest,
  PageResponse,
  JobSearchPageable,
  CompanyProfileInterface
} from '../utils/interface';

/**
 * Get all users with pagination (Admin only)
 * GET /api/users
 */
export const GetUsersAPI = async (
  pageable: JobSearchPageable = { page: 0, size: 10 }
): Promise<PageResponse<AdminUserInterface> | null> => {
  try {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sortParam => {
        params.append('sort', sortParam);
      });
    }

    const response = await axiosInstance.get<PageResponse<AdminUserInterface>>(
      `/users?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Update user status (Admin only)
 * PATCH /api/users/{id}/status
 */
export const UpdateUserStatusAPI = async (
  userId: string,
  data: UpdateUserStatusRequest
): Promise<AdminUserInterface | null> => {
  try {
    const response = await axiosInstance.patch<AdminUserInterface>(
      `/users/${userId}/status`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/{id}
 */
export const DeleteUserAPI = async (userId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Get all companies with pagination (Admin only)
 * GET /api/companies
 */
export const GetAllCompaniesAPI = async (
  pageable: JobSearchPageable = { page: 0, size: 10 }
): Promise<PageResponse<CompanyProfileInterface> | null> => {
  try {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sortParam => {
        params.append('sort', sortParam);
      });
    }

    const response = await axiosInstance.get<PageResponse<CompanyProfileInterface>>(
      `/companies?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Delete company (Admin only)
 * DELETE /api/companies/{id}
 */
export const DeleteCompanyAPI = async (companyId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/companies/${companyId}`);
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};
