import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORT CONTEXTS ---
import { UserAuthProvider } from '../user/contexts/UserAuthContext';
import { UserCartProvider } from '../user/contexts/UserCartContext';
import { AuthProvider as AdminAuthProvider } from '../contexts/AuthContext';

// --- IMPORT SUB-ROUTES ---
import AdminRoutes from './AdminRoutes';
import UserRoutes from '../user/routes/UserRoutes';

// --- IMPORT AUTH PAGES (CHUNG) ---
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

function AppRoutes() {
    return (
        <Routes>
            {/* 1. TRANG ĐĂNG NHẬP (Dùng chung) */}
            {/* Cần cả 2 Context để kiểm tra user là Admin hay Customer */}
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

            {/* 2. TRANG ĐĂNG KÝ (Chỉ dành cho Customer) */}
            <Route
                path="/register"
                element={
                    <UserAuthProvider>
                        <RegisterPage />
                    </UserAuthProvider>
                }
            />

            {/* 3. KHU VỰC ADMIN (Bắt đầu bằng /admin) */}
            <Route
                path="/admin/*"
                element={
                    <AdminAuthProvider>
                        <AdminRoutes />
                    </AdminAuthProvider>
                }
            />

            {/* 4. KHU VỰC USER (Các đường dẫn còn lại) */}
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
    );
}

export default AppRoutes;