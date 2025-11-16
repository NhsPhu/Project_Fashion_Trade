// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AuthService from '../services/AuthService'; // Import dịch vụ HỢP NHẤT
import { Spin } from 'antd';

// SỬA LỖI: Không cần import axios hay ApiService ở đây
// Interceptor của ApiService sẽ tự động lấy token từ localStorage

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [requires2FA, setRequires2FA] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = AuthService.getToken();
        const storedUser = AuthService.getCurrentUser();
        const storedUserType = AuthService.getUserType();

        if (token && storedUser && storedUserType) {
            setIsAuthenticated(true);
            setUser(storedUser);
            setUserType(storedUserType);
            // SỬA LỖI: Không cần gọi AuthService.init() hay set axios defaults
            // Instance 'api' (từ ApiService) đã tự làm điều này khi nó được import
        }
        setLoading(false);
    }, []);

    const login = async (email, password, totpCode) => {
        if (!totpCode) {
            setRequires2FA(false);
        }

        const result = await AuthService.login(email, password, totpCode);

        if (result.requires2FA) {
            setRequires2FA(true); // Yêu cầu 2FA, chưa đăng nhập
            return result;
        }

        setIsAuthenticated(true);
        setUser(result.user);
        setUserType(result.userType);
        setRequires2FA(false);
        return result;
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
        setRequires2FA(false);
    };

    const value = useMemo(() => ({
        isAuthenticated,
        user,
        userType,
        requires2FA,
        login,
        logout,
        loading
    }), [isAuthenticated, user, userType, requires2FA, loading]);

    if (loading) {
        return <Spin size="large" fullscreen tip="Đang tải ứng dụng..." />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh (giữ nguyên)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider');
    }
    return context;
};