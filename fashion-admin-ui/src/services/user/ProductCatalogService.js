// src/services/user/ProductCatalogService.js
import { publicApiClient } from './httpClient';

const ProductCatalogService = {
  getProducts: async (filters = {}) => {
    const response = await publicApiClient.get('/public/products', { params: filters });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await publicApiClient.get(`/public/products/${id}`);
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