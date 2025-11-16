// src/services/admin/BrandService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Thương hiệu (Brand)
 */
const BrandService = {

    /**
     * Lấy danh sách tất cả thương hiệu
     */
    getAllBrands: async () => {
        try {
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/brands');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thương hiệu:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách thương hiệu');
        }
    },

    /**
     * MỚI: Lấy chi tiết một thương hiệu
     */
    getBrandById: async (id) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/brands/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy thương hiệu ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải chi tiết thương hiệu');
        }
    },

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
};

export default BrandService;