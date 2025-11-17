// src/services/user/httpClient.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const USER_TOKEN_KEY = 'user_token';
const ADMIN_TOKEN_KEY = 'admin_token';
const SESSION_KEY = 'user_cart_session'; // ĐÃ CÓ

// PUBLIC CLIENT – KHÔNG GỬI TOKEN
export const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

// USER CLIENT – GỬI TOKEN
export const userApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

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

// THÊM DÒNG NÀY: EXPORT CÁC KEY
export { USER_TOKEN_KEY, ADMIN_TOKEN_KEY, SESSION_KEY };