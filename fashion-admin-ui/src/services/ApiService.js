// src/services/ApiService.js
import axios from 'axios';

// 1. BASE URL CHUNG
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// 2. CLIENT CÔNG KHAI: KHÔNG GỬI TOKEN
export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// 3. CLIENT CHUNG: GỬI TOKEN NẾU KHÔNG PHẢI PUBLIC ROUTE
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('app_token');
    // ĐÃ SỬA: KHÔNG GỬI TOKEN CHO /public/*
    if (token && !config.url.startsWith('/public/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;