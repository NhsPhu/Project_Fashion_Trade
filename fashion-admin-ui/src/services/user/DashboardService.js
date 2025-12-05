import axios from 'axios';

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
            // (axios.defaults.baseURL đã được cài đặt trong AuthContext)
            const response = await axios.get('/api/v1/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu dashboard:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải dữ liệu thống kê');
        }
    }
};

export default DashboardService;