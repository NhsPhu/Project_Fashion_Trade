import React, { createContext, useContext, useMemo, useState } from 'react';
import UserAuthService from '../services/user/UserAuthService'; // (Đảm bảo đường dẫn này đúng)

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  // 1. Thêm state cho User (lấy từ localStorage nếu có)
  const [token, setToken] = useState(UserAuthService.getToken());
  const [user, setUser] = useState(UserAuthService.getUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await UserAuthService.login(email, password);
      // 2. Cập nhật cả Token và User
      setToken(UserAuthService.getToken());
      setUser(UserAuthService.getUser()); // Lấy user vừa được lưu
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    UserAuthService.logout();
    setToken(null);
    setUser(null); // 3. Xóa User khỏi state
  };

  const value = useMemo(() => ({
    token,
    user, // 4. Cung cấp 'user' cho toàn ứng dụng
    isAuthenticated: Boolean(token),
    login,
    logout,
    isLoading,
  }), [token, user, isLoading]); // 5. Thêm 'user' vào dependency

  return (
      <UserAuthContext.Provider value={value}>
        {children}
      </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);