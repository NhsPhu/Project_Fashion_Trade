// src/user/routes/UserRoutes.js

import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../components/layout/UserLayout';
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';
import CategoryListPage from '../pages/CategoryListPage';
import BrandListPage from '../pages/BrandListPage';
import UserLoginPage from '../pages/UserLoginPage';
import UserRegisterPage from '../pages/UserRegisterPage';

const UserRoutes = () => {
    return (
        <Routes>
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
        </Routes>
    );
};

export default UserRoutes;