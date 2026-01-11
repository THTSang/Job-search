import { axiosInstance } from './config';
import type { CompanyProfileInterface } from '../utils/interface';

// NOTE: GET COMPANY API

export const GetCompanyAPI = async (): Promise<CompanyProfileInterface | null> => {
  try {
    const response = await axiosInstance.get('/companies/my-company');
    return response.data;
  } catch (error) {
    console.error('Error: Getting company API', error);
    throw error;
  }
}

// NOTE: POST COMPANY API
export const PostCompanyAPI = async (req: CompanyProfileInterface): Promise<CompanyProfileInterface | null> => {
  try {
    const { id, recruiterId, isVerified, createdAt, updatedAt, ...companyProfileRequest }: CompanyProfileInterface = req;
    const response = await axiosInstance.post<CompanyProfileInterface>('/companies', companyProfileRequest)
    return response.data
  } catch (error) {
    console.error('Error: Posting company API', error);
    throw error;
  }
}

// NOTE: PUT COMPANY API
export const PutCompanyAPI = async (req: CompanyProfileInterface): Promise<CompanyProfileInterface | null> => {
  try {
    const { id, recruiterId, isVerified, createdAt, updatedAt, ...companyProfileRequest }: CompanyProfileInterface = req;
    const response = await axiosInstance.put<CompanyProfileInterface>(`/companies/${id}`, companyProfileRequest)
    return response.data
  } catch (error) {
    console.error('Error: Putting company API', error);
    throw error;
  }
}

// NOTE: GET COMPANY BY ID API
export const GetCompanyByIdAPI = async (companyId: string): Promise<CompanyProfileInterface | null> => {
  try {
    const response = await axiosInstance.get<CompanyProfileInterface>(`/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error: Getting company by ID', error);
    throw error;
  }
}

