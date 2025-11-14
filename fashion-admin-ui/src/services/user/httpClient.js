// src/services/user/httpClient.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
const USER_TOKEN_KEY = 'user_token';
const ADMIN_TOKEN_KEY = 'admin_token'; // Thêm
const SESSION_KEY = 'user_cart_session';

export const userApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

// Gắn token (ưu tiên admin_token nếu có)
userApiClient.interceptors.request.use(config => {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const userToken = localStorage.getItem(USER_TOKEN_KEY);
    const sessionId = localStorage.getItem(SESSION_KEY);

    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    }
    if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
    }
    return config;
});

// Xử lý lỗi 401/403 → Đăng xuất
userApiClient.interceptors.response.use(
    res => res,
    err => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem(USER_TOKEN_KEY);
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(SESSION_KEY);
            // Chuyển về trang login phù hợp
            const isAdminPath = window.location.pathname.startsWith('/admin');
            window.location.href = isAdminPath ? '/login' : '/user/login';
        }
        return Promise.reject(err);
    }
);

export { USER_TOKEN_KEY, ADMIN_TOKEN_KEY, SESSION_KEY };