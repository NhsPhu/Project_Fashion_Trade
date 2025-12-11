// src/services/user/httpClient.js
import axios from 'axios';

<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:8080/api/v1';

// 1. QUAN TRỌNG: Tên Key này phải khớp với Admin (AuthService.js)
export const TOKEN_KEY = 'fashion_app_token';
const SESSION_KEY = 'user_cart_session';

=======
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
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
export const userApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

userApiClient.interceptors.request.use(config => {
<<<<<<< HEAD
    const token = localStorage.getItem(TOKEN_KEY);
    const sessionId = localStorage.getItem(SESSION_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
=======
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const userToken = localStorage.getItem(USER_TOKEN_KEY);
    const sessionId = localStorage.getItem(SESSION_KEY);

    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    }
    if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
    }
<<<<<<< HEAD

    return config;
}, error => Promise.reject(error));

export { SESSION_KEY };
=======
    return config;
});

// THÊM DÒNG NÀY: EXPORT CÁC KEY
export { USER_TOKEN_KEY, ADMIN_TOKEN_KEY, SESSION_KEY };
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
