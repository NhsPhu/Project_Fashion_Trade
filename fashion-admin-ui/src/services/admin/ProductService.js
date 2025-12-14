// src/services/admin/ProductService.js

// FIX: Import apiClient from AuthService (NOT api from ApiService)
// Adjust the path '../AuthService' based on your folder structure
import { apiClient } from '../../services/AuthService';

const ProductService = {
    // 1. Get product list (with pagination)
    getAllProducts: async (page = 0, size = 10, sort = 'id,desc') => {
        try {
            // FIX: Use apiClient
            const response = await apiClient.get(`/admin/products?page=${page}&size=${size}&sort=${sort}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product list:', error);
            throw error;
        }
    },

    // 2. Get product details
    getProductById: async (id) => {
        try {
            const response = await apiClient.get(`/admin/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },

    // 3. Create new product
    createProduct: async (productData) => {
        try {
            const response = await apiClient.post('/admin/products', productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // 4. Update product
    updateProduct: async (id, productData) => {
        try {
            const response = await apiClient.put(`/admin/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    },

    // 5. Delete product
    deleteProduct: async (id) => {
        try {
            await apiClient.delete(`/admin/products/${id}`);
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    },

    // 6. Upload image
    uploadImage: async (formData) => {
        try {
            const response = await apiClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data; // Returns { url: "..." }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(error.response?.data?.message || 'Image upload failed');
        }
    }
};

export default ProductService;