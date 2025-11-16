// src/services/admin/CategoryService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Danh mục (Category)
 */
const CategoryService = {

    /**
     * Lấy danh sách tất cả danh mục
     */
    getAllCategories: async () => {
        try {
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/categories');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách danh mục');
        }
    },

    /**
     * Lấy chi tiết một danh mục
     */
    getCategoryById: async (id) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải chi tiết danh mục');
        }
    },

    /**
     * Tạo một danh mục mới
     */
    createCategory: async (categoryData) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.post('/admin/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Tạo danh mục thất bại');
        }
    },

    /**
     * Cập nhật một danh mục
     */
    updateCategory: async (id, categoryData) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.put(`/admin/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật danh mục ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Cập nhật danh mục thất bại');
        }
    },

    /**
     * MỚI: Xóa một danh mục
     */
    deleteCategory: async (id) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            await api.delete(`/admin/categories/${id}`);
        } catch (error) {
            console.error(`Lỗi khi xóa danh mục ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Xóa danh mục thất bại');
        }
    }
};

export default CategoryService;