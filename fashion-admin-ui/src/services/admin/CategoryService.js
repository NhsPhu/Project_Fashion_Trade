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
};

export default CategoryService;