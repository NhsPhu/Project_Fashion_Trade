// src/services/ApiService.js
import axios from 'axios';

// 1. Tạo instance Axios TRUNG TÂM
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1', // SỬA LỖI: Đảm bảo có /api/v1
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor: tự động thêm token
api.interceptors.request.use((config) => {
    // Lấy token từ localStorage (Dùng key HỢP NHẤT)
    const token = localStorage.getItem('app_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. Export trực tiếp instance
export default api;