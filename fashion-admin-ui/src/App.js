// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Contexts
import { UserAuthProvider } from './contexts/UserAuthContext';
import { UserCartProvider } from './contexts/UserCartContext';
import { AuthProvider as AdminAuthProvider } from './contexts/AuthContext';

// Import Routes
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import './App.css'; // Import CSS toàn cục nếu có

// Import Pages Login/Register chung
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Route Đăng nhập (Cấp cao nhất) */}
                {/* Cần bọc cả AdminAuth và UserAuth để LoginPage có thể check quyền và chuyển hướng */}
                <Route
                    path="/login"
                    element={
                        <AdminAuthProvider>
                            <UserAuthProvider>
                                <LoginPage />
                            </UserAuthProvider>
                        </AdminAuthProvider>
                    }
                />

                {/* 2. Route Đăng ký (Cấp cao nhất) */}
                <Route
                    path="/register"
                    element={
                        <UserAuthProvider>
                            <RegisterPage />
                        </UserAuthProvider>
                    }
                />

                {/* 3. KHU VỰC ADMIN */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminAuthProvider>
                            <AdminRoutes />
                        </AdminAuthProvider>
                    }
                />

                {/* 4. KHU VỰC USER */}
                {/* UserRoutes sẽ xử lý các trang con như home, products, cart... */}
                <Route
                    path="/*"
                    element={
                        <UserAuthProvider>
                            <UserCartProvider>
                                <UserRoutes />
                            </UserCartProvider>
                        </UserAuthProvider>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;