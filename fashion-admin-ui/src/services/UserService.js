import axios from 'axios';

// Chúng ta không cần định nghĩa API_BASE_URL nữa
// vì chúng ta đã cấu hình axios global trong AuthContext.

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Người dùng
 */
const UserService = {

    /**
     * Lấy danh sách tất cả người dùng
     */
    getAllUsers: async () => {
        try {
            const response = await axios.get('/api/v1/admin/users');
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
            // (Lưu ý: Backend của chúng ta chưa có API này,
            // chúng ta sẽ dùng tạm 'getAllUsers' và lọc.
            // Lý tưởng nhất là bạn nên thêm API GET /api/v1/admin/users/{id} vào backend)

            // --- GIẢ LẬP TẠM THỜI ---
            // const allUsers = await UserService.getAllUsers();
            // const user = allUsers.find(u => u.id.toString() === userId.toString());
            // if (user) return user;
            // else throw new Error('Không tìm thấy người dùng');

            // --- GIẢ ĐỊNH BẠN ĐÃ THÊM API NÀY Ở BACKEND ---
            // Nếu bạn chưa thêm, API này sẽ báo lỗi 404
            const response = await axios.get(`/api/v1/admin/users/${userId}`);
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
            const response = await axios.put(`/api/v1/admin/users/${userId}/status`, {
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
            const response = await axios.put(`/api/v1/admin/users/${userId}/roles`, {
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