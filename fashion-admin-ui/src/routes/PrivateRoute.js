import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * "Người gác cổng" cho các tuyến đường cần đăng nhập
 */
function PrivateRoute() {
    const { isAuthenticated } = useAuth(); // Lấy trạng thái từ Context

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, điều hướng về trang /login
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, hiển thị nội dung (thường là AdminLayout)
    return <Outlet />;
}

export default PrivateRoute;