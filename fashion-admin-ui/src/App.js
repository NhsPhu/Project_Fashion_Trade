// src/App.js
import React from 'react';
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
    );
}

export default App;