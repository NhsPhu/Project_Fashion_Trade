// src/services/user/CategoryService.js
import axios from 'axios';

/**
 * Dịch vụ xử lý API danh mục cho người dùng (không cần quyền admin)
 */
const CategoryService = {
    /**
     * Lấy danh sách tất cả danh mục (chỉ hiển thị danh mục active)
     */
    getAll: async () => {
        try {
            const response = await axios.get('/api/v1/user/categories');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh mục');
        }
    },

    /**
     * Lấy danh mục theo slug
     */
    getBySlug: async (slug) => {
        try {
            const response = await axios.get(`/api/v1/user/categories/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục ${slug}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không tìm thấy danh mục');
        }
    },
};

export default CategoryService;