// src/services/CouponService.js
import { apiClient } from '../AuthService';

const API_PREFIX = '/admin/coupons';

const CouponService = {
    getAll: async () => {
        const response = await apiClient.get(API_PREFIX);
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`${API_PREFIX}/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post(API_PREFIX, data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`${API_PREFIX}/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`${API_PREFIX}/${id}`);
        return response.data;
    },
};

export default CouponService;