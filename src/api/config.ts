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

export { axiosInstance }
