// src/services/user/ProductCatalogService.js
<<<<<<< HEAD
// THAY TOÀN BỘ NỘI DUNG FILE NÀY BẰNG CODE SAU

import { userApiClient } from './httpClient';

const ProductCatalogService = {
  getProducts: async (filters = {}) => {
    const response = await userApiClient.get('/public/products', { params: filters });
=======
import { publicApiClient } from './httpClient';

const ProductCatalogService = {
  getProducts: async (filters = {}) => {
    const response = await publicApiClient.get('/public/products', { params: filters });
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    return response.data;
  },

  getProductById: async (id) => {
<<<<<<< HEAD
    const response = await userApiClient.get(`/public/products/${id}`);
=======
    const response = await publicApiClient.get(`/public/products/${id}`);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    return response.data;
  },

  getCategories: async () => {
<<<<<<< HEAD
    const response = await userApiClient.get('/public/categories');
=======
    const response = await publicApiClient.get('/public/categories');
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    return response.data;
  },

  getBrands: async () => {
<<<<<<< HEAD
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
=======
    const response = await publicApiClient.get('/public/brands');
    return response.data;
  },
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
};

export default ProductCatalogService;