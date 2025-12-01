// src/routes/AdminRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // (Đã sửa ở lượt trước)

// Layout
import AdminLayout from '../components/layouts/AdminLayout'; // (Đảm bảo đường dẫn này đúng)

// Auth Pages (Các trang này CHỈ dành cho Admin)
import LoginPage from '../pages/LoginPage'; // (Trang đăng nhập Admin dùng chung)

// Dashboard
import DashboardPage from '../pages/DashboardPage';

// Private Route
import PrivateRoute from './PrivateRoute'; // (Nằm cùng thư mục)

// === TẤT CẢ CÁC TRANG ADMIN ===
// (Giữ nguyên tất cả các import trang Admin của bạn)
import UserListPage from '../pages/admin/users/UserListPage';
import UserEditPage from '../pages/admin/users/UserEditPage';
import ProductListPage from '../pages/admin/products/ProductListPage';
import ProductCreatePage from '../pages/admin/products/ProductCreatePage';
import ProductEditPage from '../pages/admin/products/ProductEditPage';
import OrderListPage from '../pages/admin/orders/OrderListPage';
import OrderDetailPage from '../pages/admin/orders/OrderDetailPage';
import CategoryListPage from '../pages/admin/categories/CategoryListPage';
import CategoryCreatePage from '../pages/admin/categories/CategoryCreatePage';
import CategoryEditPage from '../pages/admin/categories/CategoryEditPage';
import BrandListPage from '../pages/admin/brands/BrandListPage';
import BrandCreatePage from '../pages/admin/brands/BrandCreatePage';
import BrandEditPage from '../pages/admin/brands/BrandEditPage';
import InventoryListPage from '../pages/admin/inventory/InventoryListPage';
import InventoryUpdatePage from '../pages/admin/inventory/InventoryUpdatePage';
import CouponListPage from '../pages/admin/coupon/CouponListPage';
import CouponFormPage from '../pages/admin/coupon/CouponFormPage';
import ReportDashboard from '../pages/admin/report/ReportDashboard';
import SystemConfigPage from '../pages/admin/config/SystemConfigPage';
import ReviewManagementPage from '../pages/admin/reviews/ReviewManagementPage';
import CmsPage from '../pages/admin/cms/CmsPage';


function AdminRoutes() {
    const { isAuthenticated } = useAuth(); // (Sử dụng Context của Admin)

    return (
        <Routes>
            {/* 1. Trang Đăng nhập ADMIN */}
            <Route
                path="login"
                element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
            />

            {/* 2. ĐÃ XÓA TUYẾN ĐƯỜNG /register KHỎI ADMIN */}

            {/* 3. Các tuyến đường được bảo vệ */}
            <Route element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>

                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />

                    {/* // ===================================
                    // SỬA LỖI: THÊM 2 DÒNG BỊ THIẾU Ở ĐÂY
                    // ===================================
                    */}
                    <Route path="orders" element={<OrderListPage />} />
                    <Route path="orders/:id" element={<OrderDetailPage />} />

                    {/* (Tất cả các tuyến đường CRUD của Admin giữ nguyên) */}
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/new" element={<ProductCreatePage />} />
                    <Route path="products/edit/:id" element={<ProductEditPage />} />
                    {/* ... (v.v.) ... */}
                    <Route path="users" element={<UserListPage />} />
                    <Route path="users/edit/:id" element={<UserEditPage />} />
                    <Route path="categories" element={<CategoryListPage />} />
                    <Route path="categories/new" element={<CategoryCreatePage />} />
                    <Route path="categories/edit/:id" element={<CategoryEditPage />} />
                    <Route path="brands" element={<BrandListPage />} />
                    <Route path="brands/new" element={<BrandCreatePage />} />
                    <Route path="brands/edit/:id" element={<BrandEditPage />} />
                    <Route path="inventory" element={<InventoryListPage />} />
                    <Route path="inventory/edit/:variantId" element={<InventoryUpdatePage />} />
                    <Route path="coupons" element={<CouponListPage />} />
                    <Route path="coupons/create" element={<CouponFormPage />} />
                    <Route path="coupons/edit/:id" element={<CouponFormPage />} />
                    <Route path="reports" element={<ReportDashboard />} />
                    <Route path="config" element={<SystemConfigPage />} />
                    <Route path="reviews" element={<ReviewManagementPage />} />
                    <Route path="cms" element={<CmsPage />} />
                </Route>
            </Route>

            {/* Trang 404 cho Admin (nếu truy cập /admin/xyz-sai) */}
            <Route path="*" element={<h2 style={{ padding: 20 }}>404 - Không tìm thấy trang Admin</h2>} />
        </Routes>
    );
}

export default AdminRoutes;