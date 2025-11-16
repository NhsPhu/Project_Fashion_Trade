// src/services/admin/ProductService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

/**
 * Dịch vụ xử lý API liên quan đến Quản lý Sản phẩm
 */
const ProductService = {

    /**
     * Lấy danh sách sản phẩm (có phân trang)
     */
    getAllProducts: async (page = 0, size = 10, sort = "id,desc") => {
        try {
            const [sortField, sortDir] = sort.split(',');
            const params = {
                page: page,
                size: size,
                sort: `${sortField},${sortDir}`
            };
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/products', { params });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
        }
    },

    /**
     * MỚI: Lấy chi tiết một sản phẩm
     * @param {number} id
     */
    getProductById: async (id) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy sản phẩm ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải chi tiết sản phẩm');
        }
    },

    /**
     * Tạo một sản phẩm mới
     */
    createProduct: async (productData) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.post('/admin/products', productData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Tạo sản phẩm thất bại');
        }
    },

    /**
     * MỚI: Cập nhật một sản phẩm
     * @param {number} id
     * @param {object} productData - Dữ liệu của ProductUpdateRequestDTO
     */
    updateProduct: async (id, productData) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.put(`/admin/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật sản phẩm ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
        }
    },

    /**
     * Xóa (Archived) một sản phẩm
     */
    deleteProduct: async (id) => {
        try {
            // 2. SỬA LỖI: Dùng 'api'
            await api.delete(`/admin/products/${id}`);
        } catch (error) {
            console.error(`Lỗi khi xóa sản phẩm ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
        }
    }
};

export default ProductService;