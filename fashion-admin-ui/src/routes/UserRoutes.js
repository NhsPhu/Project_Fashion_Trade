// src/user/routes/UserRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import UserLayout from '../layout/UserLayout';

// Pages
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';

// SỬA ĐƯỜNG DẪN: từ pages/WishlistPage → pages/wishlists/WishlistPage
import WishlistPage from '../user/pages/wishlists/WishlistPage';

import CategoryPage from '../pages/CategoryPage';
import BrandPage from '../pages/BrandPage';
import CartPage from '../pages/CartPage';
import UserLoginPage from '../pages/UserLoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';

// Danh sách
import CategoryListPage from '../pages/CategoryListPage';
import BrandListPage from '../pages/BrandListPage';

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />

                {/* WISHLIST USER */}
                <Route path="wishlist" element={<WishlistPage />} />

                {/* DANH SÁCH */}
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="brands" element={<BrandListPage />} />

                {/* CHI TIẾT */}
                <Route path="categories/:slug" element={<CategoryPage />} />
                <Route path="brands/:slug" element={<BrandPage />} />

                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<UserLoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile" element={<ProfilePage />} />

                <Route index element={<Navigate to="/" replace />} />
            </Route>

            <Route path="*" element={<div style={{ padding: 50, textAlign: 'center' }}>404 - Không tìm thấy trang</div>} />
        </Routes>
    );
};

export default UserRoutes;