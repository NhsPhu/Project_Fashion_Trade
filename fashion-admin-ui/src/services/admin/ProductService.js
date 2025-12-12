// src/services/ProductService.js
import { apiClient } from '../AuthService';

const ProductService = {
    getAllProducts: async (page = 0, size = 10, sort = "id,desc") => {
        try {
            const params = { page, size, sort };
            const response = await apiClient.get('/admin/products', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProductById: async (id) => {
        const response = await apiClient.get(`/admin/products/${id}`);
        return response.data;
    },

    createProduct: async (productData) => {
        // Axios tự động xử lý Content-Type nếu productData là FormData
        const response = await apiClient.post('/admin/products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await apiClient.put(`/admin/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await apiClient.delete(`/admin/products/${id}`);
        return response.data;
    }
};

export default ProductService;