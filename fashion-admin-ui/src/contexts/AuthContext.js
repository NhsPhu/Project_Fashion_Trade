// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import axios from 'axios';

// baseURL CHỈ là địa chỉ server (port 8080), KHÔNG bao gồm /api/v1
axios.defaults.baseURL = 'http://localhost:8080';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedToken = AuthService.getToken();
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    const login = async (email, password) => {
        try {
            const receivedToken = await AuthService.login(email, password);
            setToken(receivedToken);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setToken(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        token,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;