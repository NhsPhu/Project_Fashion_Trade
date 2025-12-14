import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUT ---
import UserLayout from '../components/layouts/UserLayout';

// --- PAGES ---
import HomePage from '../pages/users/HomePage';
import ProductListPage from '../pages/users/ProductListPage';
import ProductDetailPage from '../pages/users/ProductDetailPage';
import CategoryListPage from '../pages/users/CategoryListPage';
import BrandListPage from '../pages/users/BrandListPage';
import CartPage from '../pages/users/CartPage';
import CheckoutPage from '../pages/users/CheckoutPage';
import OrderSuccessPage from '../pages/users/OrderSuccessPage';
import WishlistPage from '../pages/users/WishlistPage';
import ProfilePage from '../pages/users/ProfilePage';
import OrderDetailPage from '../pages/users/OrderDetailPage'; // User xem chi tiết đơn hàng của mình


const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                {/* Trang chủ */}
                <Route index element={<HomePage />} />

                {/* Sản phẩm & Chi tiết */}
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />

                {/* Danh mục & Thương hiệu */}
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="brands" element={<BrandListPage />} />

                {/* Giỏ hàng & Thanh toán */}
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-success" element={<OrderSuccessPage />} />

                {/* Cá nhân */}
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="profile" element={<ProfilePage />} />

                {/* Đơn hàng cá nhân */}
                <Route path="orders/:orderId" element={<OrderDetailPage />} />
            </Route>

            {/* Fallback cho User: Về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default UserRoutes;