<<<<<<< HEAD
// src/services/CategoryService.js
import { apiClient } from '../AuthService';

const CategoryService = {
    getAllCategories: async () => {
        const response = await apiClient.get('/admin/categories');
        return response.data;
    },

    getCategoryById: async (id) => {
        const response = await apiClient.get(`/admin/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await apiClient.post('/admin/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await apiClient.put(`/admin/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await apiClient.delete(`/admin/categories/${id}`);
        return response.data;
    }
=======
<<<<<<<< HEAD:fashion-admin-ui/src/services/CategoryService.js
// src/services/user/CategoryService.js
import axios from 'axios';
========
// src/services/admin/CategoryService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/CategoryService.js

/**
 * Dịch vụ xử lý API danh mục cho người dùng (không cần quyền admin)
 */
const CategoryService = {
    /**
     * Lấy danh sách tất cả danh mục (chỉ hiển thị danh mục active)
     */
    getAll: async () => {
        try {
<<<<<<<< HEAD:fashion-admin-ui/src/services/CategoryService.js
            const response = await axios.get('/api/v1/user/categories');
========
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/categories');
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/CategoryService.js
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
<<<<<<<< HEAD:fashion-admin-ui/src/services/CategoryService.js
            const response = await axios.get(`/api/v1/user/categories/${slug}`);
========
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/categories/${id}`);
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/CategoryService.js
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục ${slug}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không tìm thấy danh mục');
        }
    },
<<<<<<<< HEAD:fashion-admin-ui/src/services/CategoryService.js
========

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
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/CategoryService.js
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
};

export default CategoryService;