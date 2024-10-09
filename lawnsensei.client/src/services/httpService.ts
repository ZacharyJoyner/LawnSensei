// httpService.ts
import axios, { AxiosRequestConfig } from 'axios';
import { getAuthToken } from './authService';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: 'https://your-backend-api.com', // Replace with your backend API's base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Utility function to set authorization headers
const setAuthHeader = () => {
    const token = getAuthToken();
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

// GET request function
export const getRequest = async (url: string, config: AxiosRequestConfig = {}) => {
    try {
        setAuthHeader();
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (error) {
        console.error('GET request error:', error);
        throw error;
    }
};

// POST request function
export const postRequest = async (url: string, data: any, config: AxiosRequestConfig = {}) => {
    try {
        setAuthHeader();
        const response = await axiosInstance.post(url, data, config);
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};
