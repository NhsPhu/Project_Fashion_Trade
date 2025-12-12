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