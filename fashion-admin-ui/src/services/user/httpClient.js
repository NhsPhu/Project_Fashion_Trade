// src/services/user/httpClient.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

// SỬA LỖI: Dùng chung một key với AuthService
const TOKEN_KEY = 'app_token'; 
const SESSION_KEY = 'user_cart_session';

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

// Sửa lại interceptor để đọc đúng key
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
});

// Export các key để dùng ở nơi khác nếu cần
export { TOKEN_KEY, SESSION_KEY };
