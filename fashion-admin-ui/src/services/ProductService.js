// TỆP: src/services/ProductService.js (hoặc src/services/user/ProductService.js)

// Giả sử httpClient của bạn được cấu hình với baseURL là '/api/v1'
// hoặc bạn import nó từ một tệp cấu hình axios
// src/services/ProductService.js

// src/services/ProductService.js

// SỬA: Import 'userApiClient' theo tên và đổi tên nó thành 'httpClient'
import { userApiClient as httpClient } from './user/httpClient';
// ...
// ...

const ProductService = {
    getProducts: async (params = {}) => {
        try {
            // LỖI CŨ: /products
            // const response = await httpClient.get('/products', { params });

            // ĐÃ SỬA: Phải gọi đúng API công khai
            const response = await httpClient.get('/public/products', { params });

            return response.data;
        } catch (error) {
            console.error('API Error - getProducts:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            // LỖI CŨ: /products/{id}
            // const response = await httpClient.get(`/products/${id}`);

            // ĐÃ SỬA: Phải gọi đúng API công khai
            // (Controller của bạn dùng cả /public/products/{id} và /public/products/slug/{slug})
            // Hãy chọn 1 trong 2 tùy theo logic của bạn. Dưới đây là ví dụ dùng ID:
            const response = await httpClient.get(`/public/products/${id}`);

            return response.data;
        } catch (error) {
            console.error('API Error - getProductById:', error);
            throw error;
        }
    },
};

export default ProductService;