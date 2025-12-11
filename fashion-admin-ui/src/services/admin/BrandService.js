<<<<<<< HEAD
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
=======
<<<<<<<< HEAD:fashion-admin-ui/src/services/BrandService.js
// src/services/user/BrandService.js
import axios from 'axios';
========
// src/services/admin/BrandService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/BrandService.js

const BrandService = {
    /**
     * Lấy danh sách tất cả thương hiệu
     */
    getAll: async () => {
        try {
<<<<<<<< HEAD:fashion-admin-ui/src/services/BrandService.js
            const response = await axios.get('/api/v1/user/brands');
========
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/brands');
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/BrandService.js
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thương hiệu:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải thương hiệu');
        }
    },

    /**
<<<<<<<< HEAD:fashion-admin-ui/src/services/BrandService.js
     * Lấy thương hiệu theo slug
========
     * MỚI: Lấy chi tiết một thương hiệu
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/BrandService.js
     */
    getBySlug: async (slug) => {
        try {
<<<<<<<< HEAD:fashion-admin-ui/src/services/BrandService.js
            const response = await axios.get(`/api/v1/user/brands/${slug}`);
========
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/brands/${id}`);
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/BrandService.js
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy thương hiệu ${slug}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không tìm thấy thương hiệu');
        }
    },
<<<<<<<< HEAD:fashion-admin-ui/src/services/BrandService.js
========

    /**
     * MỚI: Tạo một thương hiệu mới
     */
    createBrand: async (brandData) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.post('/admin/brands', brandData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo thương hiệu:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Tạo thương hiệu thất bại');
        }
    },

    /**
     * MỚI: Cập nhật một thương hiệu
     */
    updateBrand: async (id, brandData) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.put(`/admin/brands/${id}`, brandData);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật thương hiệu ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Cập nhật thương hiệu thất bại');
        }
    },

    /**
     * MỚI: Xóa một thương hiệu
     */
    deleteBrand: async (id) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            await api.delete(`/admin/brands/${id}`);
        } catch (error) {
            console.error(`Lỗi khi xóa thương hiệu ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Xóa thương hiệu thất bại');
        }
    }
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/BrandService.js
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
};

export default BrandService;