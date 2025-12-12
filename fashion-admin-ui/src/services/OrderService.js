import axios from 'axios';

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Đơn hàng
 */
const OrderService = {

    /**
     * Lấy danh sách đơn hàng (có phân trang)
     */
    getAllOrders: async (page = 0, size = 10, sort = "createdAt,desc") => {
        try {
            const [sortField, sortDir] = sort.split(',');

            const params = {
                page: page,
                size: size,
                sort: `${sortField},${sortDir}`
            };

            const response = await axios.get('/api/v1/admin/orders', { params });

            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
        }
    },

    /**
     * Lấy chi tiết một đơn hàng
     */
    getOrderById: async (id) => {
        try {
            const response = await axios.get(`/api/v1/admin/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy đơn hàng ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
        }
    },

    /**
     * Cập nhật trạng thái đơn hàng
     */
    updateOrderStatus: async (id, data) => {
        try {
            const response = await axios.put(`/api/v1/admin/orders/${id}/status`, data);
            return response.data;
        // ========== ĐÃ SỬA LỖI ==========
        } catch (error) { // <-- Thêm {
            console.error(`Lỗi khi cập nhật đơn hàng ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Cập nhật đơn hàng thất bại');
        } // <-- Thêm }
        // =================================
    }
};

export default OrderService;