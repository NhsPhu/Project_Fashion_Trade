// src/services/ApiService.js
import axios from 'axios';

// 1. BASE URL CHUNG
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Key để đọc session từ localStorage
const SESSION_KEY = 'user_cart_session';

// 2. CLIENT CÔNG KHAI: KHÔNG GỬI TOKEN
export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// 3. CLIENT CHUNG: GỬI TOKEN VÀ SESSION ID
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('app_token');
    const sessionId = localStorage.getItem(SESSION_KEY); // Lấy sessionId

    // Đính kèm token nếu có
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // SỬA LỖI: Luôn đính kèm sessionId nếu có
    if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
    }

    return config;
});

export default api;
