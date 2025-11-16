// src/services/admin/DashboardService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

/**
 * Dịch vụ xử lý API cho Dashboard
 */
const DashboardService = {

    /**
     * Lấy các số liệu thống kê
     * @returns {Promise<Object>} (Gồm totalCustomers, totalOrders, totalRevenue)
     */
    getStats: async () => {
        try {
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu dashboard:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải dữ liệu thống kê');
        }
    }
};

export default DashboardService;