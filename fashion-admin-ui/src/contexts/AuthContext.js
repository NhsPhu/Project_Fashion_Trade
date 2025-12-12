// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

// --- QUAN TRỌNG: THÊM ĐOẠN NÀY ĐỂ SỬA LỖI MÀN HÌNH ĐỎ ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }
    return context;
};
// --------------------------------------------------------

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = AuthService.getToken();
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            setUser({ fullName: 'Administrator' });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const receivedToken = await AuthService.login(email, password);
        setToken(receivedToken);
        setIsAuthenticated(true);
        setUser({ email, fullName: 'Administrator' });
        return true;
    };

    const logout = () => {
        AuthService.logout();
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = '/admin/login';
    };

    const value = { token, isAuthenticated, user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;