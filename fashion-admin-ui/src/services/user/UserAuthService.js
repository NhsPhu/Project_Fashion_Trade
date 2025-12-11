// src/services/user/UserAuthService.js

// 1. SỬA IMPORT: Đổi CUSTOMER_TOKEN_KEY thành TOKEN_KEY
// (Lưu ý đường dẫn './httpClient' hoặc './user/httpClient' tùy cấu trúc thư mục của bạn,
// nhưng quan trọng là phải import TOKEN_KEY)
import { userApiClient, TOKEN_KEY } from './httpClient';

const UserAuthService = {
  login: async (email, password) => {
    const response = await userApiClient.post('/auth/login', { email, password });

    // Backend trả về accessToken
    const token = response.data?.accessToken || response.data?.token;

    if (token) {
      // 2. Dùng đúng tên biến TOKEN_KEY
      localStorage.setItem(TOKEN_KEY, token);
    }
    return response.data;
  },

  register: async (payload) => {
    const response = await userApiClient.post('/auth/register', payload);
    return response.data;
  },

  logout: () => {
    // 3. Xóa đúng key
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => {
    // 4. Lấy đúng key
    return localStorage.getItem(TOKEN_KEY);
  },
};

export default UserAuthService;