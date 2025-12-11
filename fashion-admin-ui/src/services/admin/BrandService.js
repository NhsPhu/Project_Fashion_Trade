// src/services/BrandService.js
import { apiClient } from '../AuthService';

const BrandService = {
    getAllBrands: async () => {
        const response = await apiClient.get('/admin/brands');
        return response.data;
    },

    getBrandById: async (id) => {
        const response = await apiClient.get(`/admin/brands/${id}`);
        return response.data;
    },

    createBrand: async (brandData) => {
        const response = await apiClient.post('/admin/brands', brandData);
        return response.data;
    },

    updateBrand: async (id, brandData) => {
        const response = await apiClient.put(`/admin/brands/${id}`, brandData);
        return response.data;
    },

    deleteBrand: async (id) => {
        const response = await apiClient.delete(`/admin/brands/${id}`);
        return response.data;
    }
};

export default BrandService;