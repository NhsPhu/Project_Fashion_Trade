// src/services/admin/UserService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Người dùng
 */
const UserService = {

    /**
     * Lấy danh sách tất cả người dùng
     */
    getAllUsers: async () => {
        try {
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách người dùng');
        }
    },

    /**
     * MỚI: Lấy thông tin chi tiết một người dùng
     * @param {number} userId
     */
    getUserById: async (userId) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/users/${userId}`);
            return response.data;

        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết người dùng ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải chi tiết người dùng');
        }
    },


    /**
     * Cập nhật trạng thái (Khóa/Mở)
     */
    updateUserStatus: async (userId, status) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.put(`/admin/users/${userId}/status`, {
                status: status
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái user ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Cập nhật thất bại');
        }
    },

    /**
     * Cập nhật vai trò (roles)
     */
    updateUserRoles: async (userId, roles) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.put(`/admin/users/${userId}/roles`, {
                roles: roles
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật vai trò user ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Cập nhật thất bại');
        }
    }
};

export default UserService;