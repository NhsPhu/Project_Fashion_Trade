// src/services/user/UserCartService.js

// 1. SỬA IMPORT: Đổi userApiClient -> apiClient
import { apiClient } from '../../services/AuthService';

const UserCartService = {
  getCart: async (sessionId) => {
    const params = sessionId ? { sessionId } : {};
    // 2. SỬA GỌI HÀM: Đổi userApiClient -> apiClient
    const response = await apiClient.get('/user/cart', { params });
    return response.data;
  },

  addItem: async (sessionId, payload) => {
    const params = sessionId ? { sessionId } : {};
    const response = await apiClient.post('/user/cart/items', payload, { params });
    return response.data;
  },

  updateItem: async (sessionId, itemId, quantity) => {
    const params = sessionId ? { sessionId } : {};
    const response = await apiClient.put(`/user/cart/items/${itemId}`, { quantity }, { params });
    return response.data;
  },

  removeItem: async (sessionId, itemId) => {
    const params = sessionId ? { sessionId } : {};
    const response = await apiClient.delete(`/user/cart/items/${itemId}`, { params });
    return response.data;
  },

  clearCart: async (sessionId) => {
    const params = sessionId ? { sessionId } : {};
    await apiClient.delete('/user/cart', { params });
  },
};

export default UserCartService;