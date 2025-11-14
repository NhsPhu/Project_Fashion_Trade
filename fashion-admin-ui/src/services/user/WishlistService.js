// src/services/user/WishlistService.js
import { userApiClient } from './httpClient';

const WishlistService = {
  // ==================== USER ====================
  getWishlist: async () => {
    const res = await userApiClient.get('/user/wishlist');
    return res.data;
  },

  addToWishlist: async (productId) => {
    await userApiClient.post(`/user/wishlist/${productId}`);
  },

  removeFromWishlist: async (productId) => {
    await userApiClient.delete(`/user/wishlist/${productId}`);
  },

  // ==================== ADMIN ====================
  getAllWishlists: async (page = 0, size = 10) => {
    const res = await userApiClient.get('/admin/wishlists', { params: { page, size } });
    return res.data;
  },

  getWishlistByUserId: async (userId) => {
    const res = await userApiClient.get(`/admin/wishlists/user/${userId}`);
    return res.data;
  },

  removeItem: async (itemId) => {
    await userApiClient.delete(`/admin/wishlists/items/${itemId}`);
  },
};

export default WishlistService;