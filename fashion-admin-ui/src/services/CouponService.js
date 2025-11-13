// src/services/CouponService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/admin/coupons';

export default {
    getAll: async () => {
        const res = await axios.get(API_URL);
        return res.data;
    },
    getById: async (id) => {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    },
    create: async (data) => {
        await axios.post(API_URL, data);
    },
    update: async (id, data) => {
        await axios.put(`${API_URL}/${id}`, data);
    },
    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    },
};