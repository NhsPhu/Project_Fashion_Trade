import axios from 'axios';

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Danh mục (Category)
 */
const CategoryService = {

    /**
     * Lấy danh sách tất cả danh mục
     */
    getAllCategories: async () => {
        try {
            const response = await axios.get('/api/v1/admin/categories');
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
            const response = await axios.get(`/api/v1/admin/categories/${id}`);
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
            const response = await axios.post('/api/v1/admin/categories', categoryData);
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
            const response = await axios.put(`/api/v1/admin/categories/${id}`, categoryData);
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
            await axios.delete(`/api/v1/admin/categories/${id}`);
        // ========== ĐÃ SỬA LỖI ==========
        } catch (error) { // <-- Thêm {
            console.error(`Lỗi khi xóa danh mục ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Xóa danh mục thất bại');
        } // <-- Thêm }
        // =================================
    }
};

export default CategoryService;