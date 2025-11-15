// src/services/AuthService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

const AuthService = {

    // ĐĂNG NHẬP + 2FA
    login: async (email, password, totpCode = null) => {
        try {
            const payload = totpCode
                ? { sessionToken: localStorage.getItem('session_token'), totpCode }
                : { email, password };

            const endpoint = totpCode ? '/auth/verify-2fa' : '/auth/login';

            const response = await apiClient.post(endpoint, payload);
            const data = response.data;

            if (data.requires2FA) {
                localStorage.setItem('session_token', data.sessionToken);
                return { requires2FA: true, sessionToken: data.sessionToken };
            }

            const token = data.accessToken;
            localStorage.setItem('admin_token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.removeItem('session_token');
            return { token, user: data.user };

        } catch (error) {
            localStorage.removeItem('session_token');
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    },

    // ĐĂNG KÝ
    register: async (registerData) => {
        try {
            const response = await apiClient.post('/auth/register', registerData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },

    // LẤY TOKEN
    getToken: () => localStorage.getItem('admin_token'),
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // ĐĂNG XUẤT
    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        localStorage.removeItem('session_token');
    }
};

export default AuthService;