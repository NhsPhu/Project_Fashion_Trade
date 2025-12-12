// src/services/CouponService.js
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
    },
};

export default CouponService;