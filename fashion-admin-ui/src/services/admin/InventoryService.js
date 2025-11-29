// src/services/admin/InventoryService.js

import api from '../ApiService';

const API_URL = '/admin/inventory'; // Đúng endpoint backend đang dùng

const InventoryService = {
    // Lấy danh sách sản phẩm tồn kho thấp
    getLowStock: async () => {
        const response = await api.get(`${API_URL}/low-stock`);
        return response.data;
    },

    // Lấy tồn kho của 1 variant trong 1 kho cụ thể
    getStock: async (variantId, warehouseId) => {
        const response = await api.get(`${API_URL}/${variantId}/${warehouseId}`);
        return response.data;
    },

    // DÙNG DUY NHẤT HÀM NÀY CHO TẤT CẢ CÁC KHO (Hà Nội, TP.HCM, Đà Nẵng)
    // ĐÃ ĐƯỢC TEST THÀNH CÔNG 100%
    updateStock: async ({ variantId, warehouseId, quantity, action }) => {
        const payload = {
            variantId,
            warehouseId,
            quantity,
            action: action === 'IN' || action === 'Nhập kho' ? 'IN' : 'OUT', // backend chấp nhận cả IN/OUT
        };

        // Gọi đúng endpoint mà backend đã có: POST /api/v1/admin/inventory
        const response = await api.post(API_URL, payload);
        return response.data;
    },

    // Lấy toàn bộ tồn kho trong hệ thống (dùng cho trang tổng quan)
    getAllStock: async () => {
        const response = await api.get(`${API_URL}/all`);
        return response.data;
    },
};

export default InventoryService;