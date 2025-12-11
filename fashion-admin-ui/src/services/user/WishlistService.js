// src/services/user/WishlistService.js
import { userApiClient } from './httpClient';

const WishlistService = {
  // ==================== USER ====================
  getWishlist: async () => {
    const res = await userApiClient.get('/user/wishlist');
    return res.data;
  },

  // ĐÃ SỬA: Bắt lỗi 409 khi sản phẩm đã có trong wishlist
  addToWishlist: async (productId) => {
    try {
      await userApiClient.post(`/user/wishlist/${productId}`);
      return true; // thành công
    } catch (error) {
      // Backend trả 409 → đã có trong wishlist
      if (error.response?.status === 409) {
        throw new Error('ALREADY_IN_WISHLIST');
      }
      // Các lỗi khác (500, 401, v.v.)
      throw new Error(error.response?.data?.message || 'Không thể thêm vào danh sách yêu thích');
    }
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