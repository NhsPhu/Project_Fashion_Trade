import axios from 'axios';

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
            const response = await axios.get('/api/v1/admin/products', { params });
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
            const response = await axios.get(`/api/v1/admin/products/${id}`);
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
            const response = await axios.post('/api/v1/admin/products', productData);
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
            const response = await axios.put(`/api/v1/admin/products/${id}`, productData);
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
            await axios.delete(`/api/v1/admin/products/${id}`);
        } catch (error) {
            console.error(`Lỗi khi xóa sản phẩm ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
        }
    }
};

export default ProductService;