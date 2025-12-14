// src/services/user/OrderService.js

// SỬA: Import apiClient từ AuthService để có Token (User đăng nhập mới đặt hàng được)
import { apiClient } from '../../services/AuthService';

const OrderService = {
    // --- SỬA Ở ĐÂY: XÓA CHỮ "/checkout" ---
    createOrder: async (orderData) => {
        // Chỉ gọi "/orders"
        const response = await apiClient.post('/orders', orderData);
        return response.data;
    },


    // 2. Lấy danh sách đơn hàng của tôi
    getMyOrders: async () => {
        const response = await apiClient.get('/orders/my-orders');
        return response.data;
    },

    // 3. Lấy chi tiết đơn hàng
    getOrderById: async (orderId) => {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    }
};

export default OrderService;