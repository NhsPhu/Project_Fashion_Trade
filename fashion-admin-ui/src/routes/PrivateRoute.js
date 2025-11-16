import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // (Đảm bảo đường dẫn này đúng)

function PrivateRoute() {
    const { isAuthenticated, user } = useAuth(); // (Sử dụng Context của Admin)
    const location = useLocation();

    // 1. Kiểm tra nếu chưa đăng nhập
    if (!isAuthenticated) {
        // Chuyển hướng về trang đăng nhập ADMIN,
        // mang theo trang họ đang cố truy cập (state={{ from: location }})
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // 2. (Tùy chọn) Logic kiểm tra vai trò (Role)
    // Nếu bạn muốn bảo vệ các trang cụ thể (ví dụ: /admin/users)
    // khỏi các vai trò không phải SUPER_ADMIN

    /* const restrictedRoutes = {
        '/admin/users': ['SUPER_ADMIN'],
        '/admin/users/edit/:id': ['SUPER_ADMIN'],
    };

    const currentPath = location.pathname;

    // Tìm route có tham số động
    const restrictedPath = Object.keys(restrictedRoutes).find(route => {
        const regex = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
        return regex.test(currentPath);
    });

    if (restrictedPath) {
        const requiredRoles = restrictedRoutes[restrictedPath];
        // Kiểm tra xem user có bất kỳ vai trò nào được yêu cầu không
        const hasPermission = requiredRoles.some(role => user?.roles?.includes(role));

        if (!hasPermission) {
            // Nếu không có quyền, đá về trang Dashboard
            return <Navigate to="/admin/dashboard" replace />;
        }
    }
    */

    // 3. Nếu đã đăng nhập (và có quyền), cho phép truy cập
    return <Outlet />; // Hiển thị các trang con (AdminLayout, DashboardPage, v.v.)
}

export default PrivateRoute;