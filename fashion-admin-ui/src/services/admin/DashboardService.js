// src/services/DashboardService.js

// 1. Import apiClient từ AuthService để đảm bảo có Token
import { apiClient } from '../AuthService';

const DashboardService = {

    // 1. Lấy thống kê tổng quan (Cards: Tổng User, Doanh thu, Đơn hàng...)
    getStats: async () => {
        try {
            const response = await apiClient.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy thống kê tổng quan:", error);
            throw error;
        }
    },

    // 2. Lấy dữ liệu biểu đồ doanh thu (Theo ngày/tháng/năm)
    // period: 'day', 'week', 'month', 'year'
    getRevenueChart: async (period = 'month') => {
        try {
            const response = await apiClient.get('/admin/dashboard/revenue-chart', {
                params: { period }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy biểu đồ doanh thu:", error);
            throw error;
        }
    },

    // 3. Lấy danh sách đơn hàng mới nhất (Ví dụ: 5 đơn gần nhất)
    getRecentOrders: async (limit = 5) => {
        try {
            const response = await apiClient.get('/admin/dashboard/recent-orders', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy đơn hàng mới:", error);
            throw error;
        }
    },

    // 4. Lấy Top sản phẩm bán chạy
    getTopSellingProducts: async (limit = 5) => {
        try {
            const response = await apiClient.get('/admin/dashboard/top-products', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy top sản phẩm:", error);
            throw error;
        }
    },

    // 5. Lấy danh sách sản phẩm sắp hết hàng (Cảnh báo tồn kho)
    getLowStockAlerts: async (threshold = 10) => {
        try {
            // Có thể gọi API inventory hoặc dashboard tùy backend thiết kế
            const response = await apiClient.get('/admin/inventory/low-stock', {
                params: { threshold }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy cảnh báo tồn kho:", error);
            throw error;
        }
    },

    // 6. Thống kê tỷ lệ đơn hàng (Thành công/Hủy/Đang xử lý)
    getOrderStatusStats: async () => {
        try {
            const response = await apiClient.get('/admin/dashboard/order-status-stats');
            return response.data;
        } catch (error) {
            console.error("Lỗi thống kê trạng thái đơn:", error);
            throw error;
        }
    }
};

export default DashboardService;