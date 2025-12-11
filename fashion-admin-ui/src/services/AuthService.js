// src/services/AuthService.js
<<<<<<< HEAD
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
=======
import api from './ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM

// 2. SỬA LỖI: Xóa 'apiClient' và 'setAuthToken', vì 'api' đã có sẵn

// Các key lưu trữ
const TOKEN_KEY = 'app_token';
const USER_KEY = 'app_user';
const USER_TYPE_KEY = 'app_user_type';

const AuthService = {
    login: async (email, password, totpCode = null) => {
        try {
            const adminPayload = { email, password, totpCode };
            // 3. SỬA LỖI: Dùng 'api'
            const response = await api.post('/admin/auth/login', adminPayload);

            const { accessToken, user } = response.data;

            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            localStorage.setItem(USER_TYPE_KEY, 'admin');
            // Không cần setAuthToken, interceptor của 'api' sẽ tự làm

            return { token: accessToken, user, userType: 'admin' };

        } catch (adminError) {
            if (adminError.response && adminError.response.data?.message === 'Yêu cầu mã 2FA') {
                return { requires2FA: true };
            }

            try {
                const customerPayload = { email, password };
                // 3. SỬA LỖI: Dùng 'api'
                const response = await api.post('/auth/login', customerPayload);

                const { accessToken } = response.data;
                localStorage.setItem(TOKEN_KEY, accessToken);

                // 3. SỬA LỖI: Dùng 'api'
                const meResponse = await api.get('/users/me');
                const user = meResponse.data;

                localStorage.setItem(USER_KEY, JSON.stringify(user));
                localStorage.setItem(USER_TYPE_KEY, 'customer');

                return { token: accessToken, user, userType: 'customer' };

            } catch (customerError) {
                throw new Error('Sai email hoặc mật khẩu.');
            }
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        }
    },

    register: async (registerData) => {
<<<<<<< HEAD
        const response = await apiClient.post('/auth/register', registerData);
        return response.data;
    },

    getToken: () => localStorage.getItem(TOKEN_KEY),

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        // Xóa sạch để tránh xung đột
        localStorage.clear();
    }
=======
        try {
            // 3. SỬA LỖI: Dùng 'api'
            const response = await api.post('/auth/register', registerData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_TYPE_KEY);
        // Interceptor sẽ tự động thấy token bị thiếu
    },

    // Hàm tiện ích (giữ nguyên)
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getCurrentUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    getUserType: () => localStorage.getItem(USER_TYPE_KEY),
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
};

export default AuthService;