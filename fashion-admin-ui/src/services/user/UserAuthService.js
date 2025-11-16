import { userApiClient, USER_TOKEN_KEY } from './httpClient';

// 1. Thêm một key mới để lưu User trong localStorage
const USER_DATA_KEY = 'user_data';

const UserAuthService = {

  // 2. Tách hàm lấy thông tin User
  getMe: async () => {
    try {
      // (userApiClient đã được cấu hình Auth Header)
      const response = await userApiClient.get('/users/me');
      // 3. Lưu thông tin user (dưới dạng chuỗi JSON)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Không thể lấy thông tin user', error);
      return null;
    }
  },

  login: async (email, password) => {
    const response = await userApiClient.post('/auth/login', { email, password });
    if (response.data?.accessToken) {
      localStorage.setItem(USER_TOKEN_KEY, response.data.accessToken);

      // 4. SAU KHI ĐĂNG NHẬP: Gọi ngay hàm /me
      await UserAuthService.getMe();
    }
    return response.data;
  },

  register: async (payload) => {
    // ... (giữ nguyên)
  },

  logout: () => {
    localStorage.removeItem(USER_TOKEN_KEY);
    // 5. Khi đăng xuất, XÓA cả thông tin user
    localStorage.removeItem(USER_DATA_KEY);
  },

  getToken: () => localStorage.getItem(USER_TOKEN_KEY),

  // 6. Hàm mới: Lấy user từ localStorage
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_DATA_KEY));
    } catch (e) {
      return null;
    }
  },
};

export default UserAuthService;