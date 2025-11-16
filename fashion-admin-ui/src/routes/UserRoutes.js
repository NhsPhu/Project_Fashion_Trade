import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import UserLayout from '../components/layouts/UserLayout'; // (Đã sửa đường dẫn)

// Pages
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/user/ProductListPage';
import ProductDetailPage from '../pages/user/ProductDetailPage';
import WishlistPage from '../pages/user/wishlists/WishlistPage';

// (Tạm ẩn 2 tệp chi tiết chưa tạo)
// import CategoryPage from '../pages/CategoryPage';
// import BrandPage from '../pages/BrandPage';

import CartPage from '../pages/user/CartPage';
import UserLoginPage from '../pages/LoginPage'; // (Sửa: Dùng LoginPage chung)
import RegisterPage from '../pages/RegisterPage'; // (Sửa: Đường dẫn đúng)
import ProfilePage from '../pages/user/ProfilePage';

// Danh sách
import CategoryListPage from '../pages/user/CategoryListPage';
import BrandListPage from '../pages/user/BrandListPage';

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

                {/* (Tạm ẩn 2 tuyến đường bị lỗi) */}
                {/* <Route path="categories/:slug" element={<CategoryPage />} /> */}
                {/* <Route path="brands/:slug" element={<BrandPage />} /> */}

                <Route path="cart" element={<CartPage />} />

                {/* ĐÂY LÀ ĐƯỜNG DẪN ĐÚNG */}
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