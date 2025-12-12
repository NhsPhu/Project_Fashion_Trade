// src/services/user/ProductCatalogService.js
// THAY TOÀN BỘ NỘI DUNG FILE NÀY BẰNG CODE SAU

import { userApiClient } from './httpClient';

const ProductCatalogService = {
  getProducts: async (filters = {}) => {
    const response = await userApiClient.get('/public/products', { params: filters });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await userApiClient.get(`/public/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await userApiClient.get('/public/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await userApiClient.get('/public/brands');
    return response.data;
  },

  // HÀM MỚI – ĐÂY LÀ THỨ GÂY LỖI BAN ĐẦU
  addReview: async (productId, reviewData) => {
    const response = await userApiClient.post('/user/reviews', {
      productId,
      rating: reviewData.rating,
      title: reviewData.title || "Đánh giá sản phẩm",
      body: reviewData.body
    });
    return response.data; // backend trả về review vừa tạo (có userName, id, createdAt…)
  },
};

export default ProductCatalogService;