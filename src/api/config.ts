import axios from 'axios'
import { useUserCredential } from '../store'

const axiosInstance = axios.create({
  baseURL: '/api',
  // timeout: 5000,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useUserCredential.getState();

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      const state = useUserCredential.getState();
      
      // Only clear and redirect if we have a token (user was logged in)
      if (state.token) {
        state.setToken('');
        state.setUserBasicInfo(null);
        // Redirect to login page
        window.location.href = '/auth';
      }
    }
    
    // Log error in development only (without sensitive data)
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        // Don't log response.data.message to avoid exposing server internals
        code: error.code,
      });
    }
    
    // Pass error to caller for handling
    return Promise.reject(error);
  }
);

export { axiosInstance }
