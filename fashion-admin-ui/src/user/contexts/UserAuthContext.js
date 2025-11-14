import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import UserAuthService from '../../services/user/UserAuthService';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(UserAuthService.getToken());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setToken(UserAuthService.getToken());
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await UserAuthService.login(email, password);
      setToken(UserAuthService.getToken());
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    UserAuthService.logout();
    setToken(null);
  };

  const value = useMemo(() => ({
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
    isLoading,
  }), [token, isLoading]);

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);



