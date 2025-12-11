// src/services/user/BrandService.js
import axios from 'axios';

const BrandService = {
    /**
     * Lấy danh sách tất cả thương hiệu
     */
    getAll: async () => {
        try {
            const response = await axios.get('/api/v1/user/brands');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thương hiệu:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải thương hiệu');
        }
    },

    /**
     * Lấy thương hiệu theo slug
     */
    getBySlug: async (slug) => {
        try {
            const response = await axios.get(`/api/v1/user/brands/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy thương hiệu ${slug}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không tìm thấy thương hiệu');
        }
    },
};

export default BrandService;