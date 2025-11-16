// src/services/CouponService.js
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
    },
};

export default CouponService;