// src/services/user/ProductCatalogService.js
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
};

export default ProductCatalogService;