// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// 1. SỬA LỖI: Import 'useAuth' trực tiếp từ AuthContext
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute() {
    // 2. SỬA LỖI: Lấy trạng thái từ context HỢP NHẤT
    const { isAuthenticated, userType } = useAuth();
    const location = useLocation();

    // 1. Kiểm tra nếu chưa đăng nhập
    if (!isAuthenticated) {
        // Chuyển hướng về trang đăng nhập CHUNG
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Kiểm tra nếu đã đăng nhập nhưng KHÔNG PHẢI ADMIN
    if (userType !== 'admin') {
        // Đá về trang chủ của User
        return <Navigate to="/" replace />;
    }

    // 3. Nếu đã đăng nhập VÀ LÀ ADMIN -> Cho phép truy cập
    return <Outlet />; // Hiển thị các trang con (AdminLayout, DashboardPage, v.v.)
}

export default PrivateRoute;