// src/App.js
import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Contexts
import { UserAuthProvider } from './contexts/UserAuthContext';
import { UserCartProvider } from './contexts/UserCartContext';
import { AuthProvider as AdminAuthProvider } from './contexts/AuthContext'; // Đổi tên để tránh trùng

// Import Routes
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* === KHU VỰC ADMIN (Truy cập qua /admin/...) === */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminAuthProvider>
                            <AdminRoutes />
                        </AdminAuthProvider>
                    }
                />

                {/* === KHU VỰC USER (Trang chủ, sản phẩm...) === */}
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
=======

// 1. SỬA: Chỉ import 1 AuthProvider HỢP NHẤT
import { AuthProvider } from './contexts/AuthContext';
// 2. XÓA: UserAuthProvider
import { UserCartProvider } from './contexts/UserCartContext';

import AppRoutes from './routes/AppRoutes'; // Import bộ định tuyến Gốc
import 'antd/dist/reset.css';
import './index.css';

function App() {
    return (
        // 3. SỬA: Chỉ dùng AuthProvider HỢP NHẤT
        <AuthProvider>
            <UserCartProvider>
                <AppRoutes />
            </UserCartProvider>
        </AuthProvider>
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    );
}

export default App;