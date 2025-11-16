import axios from 'axios';

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Thương hiệu (Brand)
 */
const BrandService = {

    /**
     * Lấy danh sách tất cả thương hiệu
     */
    getAllBrands: async () => {
        try {
            const response = await axios.get('/api/v1/admin/brands');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thương hiệu:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách thương hiệu');
        }
    },

    /**
     * MỚI: Lấy chi tiết một thương hiệu
     * (Giả định bạn đã thêm API GET /api/v1/admin/brands/{id} vào backend)
     */
    getBrandById: async (id) => {
        try {
            const response = await axios.get(`/api/v1/admin/brands/${id}`);
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
            const response = await axios.post('/api/v1/admin/brands', brandData);
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
            const response = await axios.put(`/api/v1/admin/brands/${id}`, brandData);
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
            await axios.delete(`/api/v1/admin/brands/${id}`);
        } catch (error) {
            console.error(`Lỗi khi xóa thương hiệu ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Xóa thương hiệu thất bại');
        }
    }
};

export default BrandService;