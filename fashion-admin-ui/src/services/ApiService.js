// src/services/ApiService.js
import axios from 'axios';

// Tạo instance Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: tự động thêm token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// TẠO BIẾN CÓ TÊN TRƯỚC KHI EXPORT
const ApiService = {
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    delete: (url, config = {}) => api.delete(url, config),
};

// XUẤT THEO ĐÚNG QUY TẮC ESLINT
export default ApiService;