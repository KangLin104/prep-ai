import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Interceptors for request and response
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
    ,
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific error responses
            if (error.response.status === 401) {
                window.location.href = '/';
            } else if (error.response.status >= 500) {
                // Server error, handle accordingly
                console.error('Server error');
            }
        }
        else if (error.code === "ECONNABORTED") {
            // Handle timeout error
            console.error('Request timed out');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;