// src/services/AuthService.js
import axios from 'axios';

// 1. Cấu hình Key chung
const TOKEN_KEY = 'app_token';
const API_BASE_URL = 'http://localhost:8080/api/v1';

// 2. QUAN TRỌNG: Thêm từ khóa 'export' để DashboardService có thể sử dụng
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor: Tự động gắn token vào header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const token = response.data.accessToken || response.data.token;

            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
                return token;
            }
        } catch (error) {
            throw error;
        }
    },

    register: async (registerData) => {
        const response = await apiClient.post('/auth/register', registerData);
        return response.data;
    },

    getToken: () => localStorage.getItem(TOKEN_KEY),

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        // Xóa sạch để tránh xung đột
        localStorage.clear();
    }
};

export default AuthService;