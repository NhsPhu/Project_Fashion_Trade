// src/user/contexts/UserAuthContext.js
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import UserAuthService from '../services/user/UserAuthService';

// --- SỬA LỖI: Import TOKEN_KEY (tên mới) thay vì CUSTOMER_TOKEN_KEY ---
import { TOKEN_KEY } from '../services/user/httpClient';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    // Sửa tên biến sử dụng ở đây luôn
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            const decoded = parseJwt(token);
            setUser(decoded);
        } else {
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const data = await UserAuthService.login(email, password);
            const accessToken = data.accessToken || data.token;

            if (accessToken) {
                // Sửa: Lưu vào TOKEN_KEY
                localStorage.setItem(TOKEN_KEY, accessToken);
                setToken(accessToken);
            }
            return data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        UserAuthService.logout();
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    const value = useMemo(
        () => ({
            token,
            isAuthenticated: !!token,
            user,
            login,
            logout,
            isLoading,
        }),
        [token, user, isLoading]
    );

    return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => useContext(UserAuthContext);