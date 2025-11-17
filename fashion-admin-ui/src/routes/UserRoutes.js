// src/routes/UserRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} /> {/* ĐÚNG */}
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="brands" element={<BrandListPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route index element={<Navigate to="/" replace />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route path="*" element={<div style={{ padding: 50, textAlign: 'center' }}>404 - Không tìm thấy trang</div>} />
        </Routes>
    );
};

export default UserRoutes;