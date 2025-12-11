<<<<<<< HEAD
// src/services/ProductService.js
import { apiClient } from '../AuthService';

const ProductService = {
    getAllProducts: async (page = 0, size = 10, sort = "id,desc") => {
        try {
            const params = { page, size, sort };
            const response = await apiClient.get('/admin/products', { params });
            return response.data;
        } catch (error) {
=======
<<<<<<<< HEAD:fashion-admin-ui/src/services/ProductService.js
// TỆP: src/services/ProductService.js (hoặc src/services/user/ProductService.js)

// Giả sử httpClient của bạn được cấu hình với baseURL là '/api/v1'
// hoặc bạn import nó từ một tệp cấu hình axios
// src/services/ProductService.js

// src/services/ProductService.js

// SỬA: Import 'userApiClient' theo tên và đổi tên nó thành 'httpClient'
import { userApiClient as httpClient } from './user/httpClient';
// ...
// ...
========
// src/services/admin/ProductService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/ProductService.js

const ProductService = {
    getProducts: async (params = {}) => {
        try {
<<<<<<<< HEAD:fashion-admin-ui/src/services/ProductService.js
            // LỖI CŨ: /products
            // const response = await httpClient.get('/products', { params });

            // ĐÃ SỬA: Phải gọi đúng API công khai
            const response = await httpClient.get('/public/products', { params });

========
            const [sortField, sortDir] = sort.split(',');
            const params = {
                page: page,
                size: size,
                sort: `${sortField},${sortDir}`
            };
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/products', { params });
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/ProductService.js
            return response.data;
        } catch (error) {
            console.error('API Error - getProducts:', error);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
            throw error;
        }
    },

    getProductById: async (id) => {
<<<<<<< HEAD
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
=======
        try {
<<<<<<<< HEAD:fashion-admin-ui/src/services/ProductService.js
            // LỖI CŨ: /products/{id}
            // const response = await httpClient.get(`/products/${id}`);

            // ĐÃ SỬA: Phải gọi đúng API công khai
            // (Controller của bạn dùng cả /public/products/{id} và /public/products/slug/{slug})
            // Hãy chọn 1 trong 2 tùy theo logic của bạn. Dưới đây là ví dụ dùng ID:
            const response = await httpClient.get(`/public/products/${id}`);

========
            // 2. SỬA LỖI: Dùng 'api'
            const response = await api.get(`/admin/products/${id}`);
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/ProductService.js
            return response.data;
        } catch (error) {
            console.error('API Error - getProductById:', error);
            throw error;
        }
    },
<<<<<<<< HEAD:fashion-admin-ui/src/services/ProductService.js
========

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
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/ProductService.js
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
};

export default ProductService;