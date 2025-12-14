// src/services/admin/UserService.js

// --- SỬA 1: Import apiClient từ AuthService (Nơi đã cấu hình Token) ---
import { apiClient } from '../AuthService';

const UserService = {

    /**
     * Lấy danh sách tất cả người dùng
     */
    getAllUsers: async () => {
        try {
            // --- SỬA 2: Dùng apiClient ---
            // apiClient đã có baseURL là /api/v1 nên chỉ cần gọi /admin/users
            const response = await apiClient.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            throw error;
        }
    },

    /**
     * Lấy thông tin chi tiết một người dùng
     */
    getUserById: async (userId) => {
        try {
            const response = await apiClient.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi lấy chi tiết user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Cập nhật trạng thái (Khóa/Mở)
     */
    updateUserStatus: async (userId, status) => {
        try {
            // Body gửi lên: { status: "active" } hoặc { status: "locked" }
            const response = await apiClient.put(`/admin/users/${userId}/status`, {
                status: status
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi cập nhật trạng thái user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Cập nhật vai trò (roles)
     */
    updateUserRoles: async (userId, roles) => {
        try {
            // Body gửi lên: { roles: ["ADMIN", "CUSTOMER"] }
            const response = await apiClient.put(`/admin/users/${userId}/roles`, {
                roles: roles
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi cập nhật vai trò user ${userId}:`, error);
            throw error;
        }
    }
};

export default UserService;