import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang login
        // state={{ from: location }} giúp chúng ta có thể quay lại trang checkout sau khi đăng nhập thành công
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu người dùng đã đăng nhập, cho phép họ truy cập vào component con (trang checkout)
    return children;
};

export default ProtectedRoute;
