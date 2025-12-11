// src/services/CouponService.js
<<<<<<< HEAD
import api from '../ApiService';

const API_PREFIX = '/admin/coupons';

const CouponService = {
    getAll: async () => {
        const response = await api.get(API_PREFIX);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${API_PREFIX}/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post(API_PREFIX, data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`${API_PREFIX}/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`${API_PREFIX}/${id}`);
        return response.data;
=======
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (cùng thư mục)

// 2. SỬA LỖI: Xóa '/api/v1' khỏi URL
const API_URL = '/admin/coupons';

const CouponService = {
    getAll: async () => {
        // 3. SỬA LỖI: Dùng 'api' thay vì 'axios'
        const res = await api.get(API_URL);
        return res.data;
    },

    getById: async (id) => {
        // 3. SỬA LỖI: Dùng 'api'
        const res = await api.get(`${API_URL}/${id}`);
        return res.data;
    },

    create: async (data) => {
        // 3. SỬA LỖI: Dùng 'api'
        await api.post(API_URL, data);
    },

    update: async (id, data) => {
        // 3. SỬA LỖI: Dùng 'api'
        await api.put(`${API_URL}/${id}`, data);
    },

    delete: async (id) => {
        // 3. SỬA LỖI: Dùng 'api'
        await api.delete(`${API_URL}/${id}`);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    },
};

export default CouponService;