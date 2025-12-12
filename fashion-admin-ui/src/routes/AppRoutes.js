// routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout
import AdminLayout from '../components/layout/AdminLayout';
import PrivateRoute from './PrivateRoute';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';

// CRUD Pages
import UserListPage from '../pages/users/UserListPage';
import UserEditPage from '../pages/users/UserEditPage';
import ProductListPage from '../pages/products/ProductListPage';
import ProductCreatePage from '../pages/products/ProductCreatePage';
import ProductEditPage from '../pages/products/ProductEditPage';
import OrderListPage from '../pages/orders/OrderListPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import CategoryCreatePage from '../pages/categories/CategoryCreatePage';
import CategoryEditPage from '../pages/categories/CategoryEditPage';
import BrandListPage from '../pages/brands/BrandListPage';
import BrandCreatePage from '../pages/brands/BrandCreatePage';
import BrandEditPage from '../pages/brands/BrandEditPage';

// WISHLISTS ADMIN
import WishlistListPage from '../user/pages/wishlists/WishlistListPage';
import WishlistDetailPage from '../user/pages/wishlists/WishlistDetailPage';

// USER APP
import UserApp from '../UserApp';

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Đăng nhập */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
            />

            {/* Đăng ký */}
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <RegisterPage />}
            />

            {/* ADMIN - BẢO VỆ */}
            <Route path="/admin" element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />

                    {/* USERS */}
                    <Route path="users" element={<UserListPage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />

                    {/* PRODUCTS */}
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/new" element={<ProductCreatePage />} />
                    <Route path="products/edit/:id" element={<ProductEditPage />} />

                    {/* ORDERS */}
                    <Route path="orders" element={<OrderListPage />} />
                    <Route path="orders/:id" element={<OrderDetailPage />} />

                    {/* CATEGORIES */}
                    <Route path="categories" element={<CategoryListPage />} />
                    <Route path="categories/new" element={<CategoryCreatePage />} />
                    <Route path="categories/edit/:id" element={<CategoryEditPage />} />

                    {/* BRANDS */}
                    <Route path="brands" element={<BrandListPage />} />
                    <Route path="brands/new" element={<BrandCreatePage />} />
                    <Route path="brands/edit/:id" element={<BrandEditPage />} />

                    {/* WISHLISTS ADMIN */}
                    <Route path="wishlists" element={<WishlistListPage />} />
                    <Route path="wishlists/:userId" element={<WishlistDetailPage />} />

                    {/* Mặc định */}
                    <Route index element={<Navigate to="dashboard" replace />} />
                </Route>
            </Route>

            {/* GỐC */}
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />}
            />

            {/* USER APP */}
            <Route path="/user/*" element={<UserApp />} />

            {/* 404 */}
            <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
    );
}

export default AppRoutes;