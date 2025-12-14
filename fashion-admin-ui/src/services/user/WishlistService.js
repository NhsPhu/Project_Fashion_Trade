// src/services/user/WishlistService.js

// --- SỬA QUAN TRỌNG: Import apiClient từ AuthService để có Token ---
// (Lưu ý đường dẫn: từ folder 'user' ra folder cha 'services' là '../')
import { apiClient } from '../AuthService';

const WishlistService = {
  // ==================== USER ====================
  getWishlist: async () => {
    // apiClient sẽ tự động gắn Header: Authorization: Bearer ...
    const res = await apiClient.get('/user/wishlist');
    return res.data;
  },

  addToWishlist: async (productId) => {
    try {
      await apiClient.post(`/user/wishlist/${productId}`);
      return true; // thành công
    } catch (error) {
      // Backend trả 409 → đã có trong wishlist
      if (error.response?.status === 409) {
        throw new Error('ALREADY_IN_WISHLIST');
      }
      // Các lỗi khác
      throw new Error(error.response?.data?.message || 'Không thể thêm vào danh sách yêu thích');
    }
  },

  removeFromWishlist: async (productId) => {
    await apiClient.delete(`/user/wishlist/${productId}`);
  },

  // ==================== ADMIN (Nếu dùng chung service) ====================
  getAllWishlists: async (page = 0, size = 10) => {
    const res = await apiClient.get('/admin/wishlists', { params: { page, size } });
    return res.data;
  },

  getWishlistByUserId: async (userId) => {
    const res = await apiClient.get(`/admin/wishlists/user/${userId}`);
    return res.data;
  },

  removeItem: async (itemId) => {
    await apiClient.delete(`/admin/wishlists/items/${itemId}`);
  },
};

export default WishlistService;