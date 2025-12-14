// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService'; // Import Service chung

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth error');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(AuthService.getToken());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = AuthService.getToken();
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            // Lấy thông tin user từ token giải mã
            setUser(AuthService.getCurrentUser());
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // AuthService.login đã lưu token vào localStorage rồi
        const data = await AuthService.login(email, password);
        const accessToken = data.token || data.accessToken;

        setToken(accessToken);
        setIsAuthenticated(true);
        setUser(AuthService.getCurrentUser());
        return true;
    };

    const logout = () => {
        AuthService.logout();
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = '/login'; // Về trang login chung
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;