// src/user/contexts/UserAuthContext.js
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
// IMPORT MỚI: Dùng AuthService chung
import AuthService from '../services/AuthService';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    // Khởi tạo state từ AuthService
    const [token, setToken] = useState(AuthService.getToken());
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Effect: Khi token thay đổi, cập nhật user info
    useEffect(() => {
        if (token) {
            const decoded = AuthService.getCurrentUser();
            setUser(decoded);
        } else {
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Gọi AuthService chung
            const data = await AuthService.login(email, password);
            const accessToken = data.token || data.accessToken;

            setToken(accessToken); // Update state để trigger useEffect
            return data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        AuthService.logout();
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    const value = useMemo(() => ({
        token,
        isAuthenticated: !!token,
        user,
        login,
        logout,
        isLoading,
    }), [token, user, isLoading]);

    return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => useContext(UserAuthContext);