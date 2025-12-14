// src/services/user/ProductCatalogService.js

// SỬA: Import apiClient từ AuthService để chuẩn hóa (AuthService nằm ở src/services/AuthService.js)
import { apiClient } from '../../services/AuthService';

const ProductCatalogService = {
  // 1. Lấy danh sách sản phẩm (Public)
  getProducts: async (filters = {}) => {
    const response = await apiClient.get('/public/products', { params: filters });
    return response.data;
  },

  // 2. Lấy chi tiết sản phẩm (Public)
  getProductById: async (id) => {
    const response = await apiClient.get(`/public/products/${id}`);
    return response.data;
  },

  // 3. Lấy danh mục (Public)
  getCategories: async () => {
    const response = await apiClient.get('/public/categories');
    return response.data;
  },

  // 4. Lấy thương hiệu (Public)
  getBrands: async () => {
    const response = await apiClient.get('/public/brands');
    return response.data;
  },

  // 5. Thêm đánh giá (Cần User Login)
  addReview: async (productId, reviewData) => {
    // API này cần Token, apiClient sẽ tự động gắn vào Header
    const response = await apiClient.post('/user/reviews', {
      productId,
      rating: reviewData.rating,
      title: reviewData.title || "Đánh giá sản phẩm",
      body: reviewData.body
    });
    return response.data;
  },

  // === 6. HÀM MỚI THÊM: Lấy tồn kho công khai ===
  getPublicStock: async (variantId) => {
    // Gọi API Backend vừa tạo ở Phần 1
    const response = await apiClient.get(`/public/inventory/${variantId}`);
    return response.data; // Trả về số lượng (Number)
  }
};

export default ProductCatalogService;