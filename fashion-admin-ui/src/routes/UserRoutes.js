// src/routes/UserRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Helper
import ProtectedRoute from './ProtectedRoute';

// Layout
import UserLayout from '../components/layouts/UserLayout';

// Pages
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/user/ProductListPage';
import ProductDetailPage from '../pages/user/ProductDetailPage';
import WishlistPage from '../pages/user/wishlists/WishlistPage';
import CartPage from '../pages/user/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/user/ProfilePage';
import CategoryListPage from '../pages/user/CategoryListPage';
import BrandListPage from '../pages/user/BrandListPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import MyOrdersPage from '../pages/user/MyOrdersPage'; // Import trang mới
import OrderDetailPage from '../pages/user/OrderDetailPage'; // Import trang mới

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                {/* Các trang công khai */}
                <Route path="/" element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="brands" element={<BrandListPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="order-success" element={<OrderSuccessPage />} />

                {/* Các trang cần đăng nhập */}
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                
                {/* ROUTE MỚI */}
                <Route path="user/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                <Route path="user/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

                <Route index element={<Navigate to="/" replace />} />
            </Route>

            {/* Các trang không có layout chung */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route path="*" element={<div style={{ padding: 50, textAlign: 'center' }}>404 - Không tìm thấy trang</div>} />
        </Routes>
    );
};

export default UserRoutes;
