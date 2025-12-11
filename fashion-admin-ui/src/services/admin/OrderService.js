// src/services/OrderService.js
import { apiClient } from '../AuthService';

const OrderService = {
    getAllOrders: async (page = 0, size = 10, sort = "createdAt,desc") => {
        try {
            const params = { page, size, sort };
            const response = await apiClient.get('/admin/orders', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getOrderById: async (id) => {
        const response = await apiClient.get(`/admin/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, statusData) => {
        // statusData ví dụ: { status: "DELIVERED" } hoặc FormData
        const response = await apiClient.put(`/admin/orders/${id}/status`, statusData);
        return response.data;
    }
};

export default OrderService;