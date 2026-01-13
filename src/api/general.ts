import { axiosInstance } from './config';
import type { GeneralStatsInterface } from '../utils/interface';

/**
 * Get general statistics (user count, job count, company count)
 * GET /api/general/stats
 */
export const GetGeneralStatsAPI = async (): Promise<GeneralStatsInterface | null> => {
  try {
    const response = await axiosInstance.get<GeneralStatsInterface>('/general/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching general stats:', error);
    return null;
  }
};
