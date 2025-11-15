// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function PrivateRoute() {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // 1. Chưa đăng nhập → về login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. CHỈ BẢO VỆ CÁC TRANG NHẠY CẢM (ví dụ: quản lý user)
    const restrictedRoutes = {
        '/admin/users': ['SUPER_ADMIN'],
        '/admin/users/edit/:id': ['SUPER_ADMIN'],
        // '/admin/config': ['SUPER_ADMIN'],  ← ĐÃ XÓA DÒNG NÀY
    };

    const currentPath = location.pathname;

    // Tìm route có tham số động (ví dụ: /admin/users/edit/123)
    const restrictedPath = Object.keys(restrictedRoutes).find(route => {
        const regex = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
        return regex.test(currentPath);
    });

    if (restrictedPath) {
        const requiredRoles = restrictedRoutes[restrictedPath];
        const hasPermission = requiredRoles.some(role => user?.roles?.includes(role));
        if (!hasPermission) {
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    // 3. TẤT CẢ CÁC TRANG KHÁC (config, reviews, cms...) → CHO QUA
    return <Outlet />;
}

export default PrivateRoute;