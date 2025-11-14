// src/services/user/UserAuthService.js
import { userApiClient, USER_TOKEN_KEY } from './httpClient';

const UserAuthService = {
  login: async (email, password) => {
    const response = await userApiClient.post('/auth/login', { email, password });
    if (response.data?.accessToken) {  // DÙNG accessToken
      localStorage.setItem(USER_TOKEN_KEY, response.data.accessToken);
    }
    return response.data;
  },

  register: async (payload) => {
    const response = await userApiClient.post('/auth/register', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(USER_TOKEN_KEY);
  },

  getToken: () => localStorage.getItem(USER_TOKEN_KEY),
};

export default UserAuthService;