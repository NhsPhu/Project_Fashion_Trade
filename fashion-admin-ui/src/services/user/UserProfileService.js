import { userApiClient } from '../httpClient'; // Đảm bảo đường dẫn import đúng

const UserProfileService = {
  // 1. Lấy thông tin cá nhân
  getProfile: async () => {
    const response = await userApiClient.get('/user/profile');
    return response.data;
  },

  // 2. Cập nhật thông tin
  updateProfile: async (payload) => {
    const response = await userApiClient.put('/user/profile', payload);
    return response.data;
  },

  // 3. Lấy danh sách địa chỉ
  getAddresses: async () => {
    const response = await userApiClient.get('/user/profile/addresses');
    return response.data;
  },

  // 4. Lấy lịch sử đơn hàng (Hàm này quan trọng cho ProfilePage)
  // Đảm bảo Backend có API: GET /api/v1/user/orders
  getMyOrders: async () => {
    const response = await userApiClient.get('/user/orders');
    return response.data;
  },

  // 5. Thêm địa chỉ
  addAddress: async (payload) => {
    const response = await userApiClient.post('/user/profile/addresses', payload);
    return response.data;
  },

  // 6. Sửa địa chỉ
  updateAddress: async (addressId, payload) => {
    const response = await userApiClient.put(`/user/profile/addresses/${addressId}`, payload);
    return response.data;
  },

  // 7. Xóa địa chỉ
  deleteAddress: async (addressId) => {
    await userApiClient.delete(`/user/profile/addresses/${addressId}`);
  }
};

// QUAN TRỌNG: Xuất mặc định để ProfilePage import được
export default UserProfileService;