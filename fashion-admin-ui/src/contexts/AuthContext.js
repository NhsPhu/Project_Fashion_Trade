// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/admin/AuthService';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [requires2FA, setRequires2FA] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = AuthService.getToken();
        const storedUser = AuthService.getCurrentUser();
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password, totpCode) => {
        const result = await AuthService.login(email, password, totpCode);
        if (result.requires2FA) {
            setRequires2FA(true);
            return result;
        }
        setIsAuthenticated(true);
        setUser(result.user);
        setRequires2FA(false);
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
        return result;
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setRequires2FA(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, requires2FA, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;