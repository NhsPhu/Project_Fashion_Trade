<<<<<<< HEAD
// src/user/routes/UserRoutes.js

import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../components/layouts/UserLayout';
import HomePage from '../pages/users/HomePage';
import ProductListPage from '../pages/users/ProductListPage';
import ProductDetailPage from '../pages/users/ProductDetailPage';
import CartPage from '../pages/users/CartPage';
import CheckoutPage from '../pages/users/CheckoutPage';
import OrderSuccessPage from '../pages/users/OrderSuccessPage';
import WishlistPage from '../pages/users/WishlistPage';
import ProfilePage from '../pages/users/ProfilePage';
import CategoryListPage from '../pages/users/CategoryListPage';
import BrandListPage from '../pages/users/BrandListPage';
import UserLoginPage from '../pages/users/UserLoginPage';
import UserRegisterPage from '../pages/users/UserRegisterPage';
=======
// src/routes/UserRoutes.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import ApiService from '../services/ApiService'; // Đảm bảo đường dẫn đúng

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

// Component thông minh: Hiển thị trang CMS hoặc 404
const SmartCmsOr404 = () => {
    const location = useLocation();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    const slug = location.pathname.substring(1); // bỏ dấu "/"

    useEffect(() => {
        // Chỉ xử lý slug hợp lệ (không phải file tĩnh, không chứa dấu chấm, không có query)
        if (!slug || slug.includes('.') || slug.includes('?') || slug.includes('/')) {
            setLoading(false);
            return;
        }

        ApiService.get(`/api/v1/pages/${slug}`)
            .then(res => {
                if (res.data && res.data.published) {
                    setPage(res.data);
                    document.title = res.data.metaTitle || `${res.data.title} - Fashion Shop`;
                }
            })
            .catch(() => {
                // Không làm gì cả → để hiện 404
            })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (page) {
        return (
            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', minHeight: '70vh' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                    {page.title}
                </h1>
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                    style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
                />
            </div>
        );
    }

    // 404 thật sự
    return (
        <div style={{
            padding: '100px 20px',
            textAlign: 'center',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ fontSize: '5rem', color: '#f0f0f0', margin: 0 }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#666', marginTop: '1rem' }}>
                Xin lỗi, trang bạn tìm không tồn tại.
            </p>
        </div>
    );
};
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22

const UserRoutes = () => {
    return (
        <Routes>
<<<<<<< HEAD
            {/* Route không cần layout */}
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/register" element={<UserRegisterPage />} />

            {/* Các route dùng UserLayout */}
            <Route path="/" element={<UserLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="brands" element={<BrandListPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-success" element={<OrderSuccessPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Redirect tất cả không tìm thấy */}
            <Route path="*" element={<Navigate to="/" replace />} />
=======
            <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="brands" element={<BrandListPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route index element={<Navigate to="/" replace />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* TRANG CMS HOẶC 404 – ĐÂY LÀ CHÌA KHÓA */}
            <Route path="*" element={<SmartCmsOr404 />} />
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        </Routes>
    );
};

export default UserRoutes;