// src/services/user/UserCartService.js
import { userApiClient } from './httpClient';

const UserCartService = {
  getCart: async (sessionId) => {
    const params = sessionId ? { sessionId } : {};
    const response = await userApiClient.get('/user/cart', { params });
    return response.data;
  },

  addItem: async (sessionId, payload) => {
    const params = sessionId ? { sessionId } : {};
    const response = await userApiClient.post('/user/cart/items', payload, { params });
    return response.data;
  },

  updateItem: async (sessionId, itemId, quantity) => {
    const params = sessionId ? { sessionId } : {};
    const response = await userApiClient.put(`/user/cart/items/${itemId}`, { quantity }, { params });
    return response.data;
  },

  removeItem: async (sessionId, itemId) => {
    const params = sessionId ? { sessionId } : {};
<<<<<<< HEAD
    const response = await userApiClient.delete(`/user/cart/items/${itemId}`, { params });
    return response.data;
=======
    await userApiClient.delete(`/user/cart/items/${itemId}`, { params });
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
  },

  clearCart: async (sessionId) => {
    const params = sessionId ? { sessionId } : {};
    await userApiClient.delete('/user/cart', { params });
  },
};

export default UserCartService;