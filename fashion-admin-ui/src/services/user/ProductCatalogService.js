// src/services/user/ProductCatalogService.js
import { publicApiClient } from './httpClient'; // Danh sách: không cần token
import api from '../ApiService'; // Chi tiết: cần token → DÙNG api CÓ INTERCEPTOR

const ProductCatalogService = {
  // 1. DANH SÁCH: Dùng publicApiClient → Không gửi token → permitAll()
  getProducts: async (filters = {}) => {
    const response = await publicApiClient.get('/public/products', { params: filters });
    return response.data;
  },

  // 2. CHI TIẾT: Dùng api → Gửi token → Backend cho phép nếu đã login
  getProductById: async (id) => {
    const response = await api.get(`/public/products/${id}`); // DÙNG api CÓ TOKEN
    return response.data;
  },

  getCategories: async () => {
    const response = await publicApiClient.get('/public/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await publicApiClient.get('/public/brands');
    return response.data;
  },
};

export default ProductCatalogService;