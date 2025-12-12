// src/services/user/httpClient.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 1. QUAN TRỌNG: Tên Key này phải khớp với Admin (AuthService.js)
export const TOKEN_KEY = 'fashion_app_token';
const SESSION_KEY = 'user_cart_session';

export const userApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

userApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem(TOKEN_KEY);
    const sessionId = localStorage.getItem(SESSION_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
    }

    return config;
}, error => Promise.reject(error));

export { SESSION_KEY };