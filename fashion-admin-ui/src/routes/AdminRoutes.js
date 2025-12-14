import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUT & SECURITY ---
import AdminLayout from '../components/layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';

// --- DASHBOARD ---
import DashboardPage from '../pages/admin/DashboardPage';

// --- USER MANAGEMENT ---
import UserListPage from '../pages/admin/users/UserListPage';
import UserEditPage from '../pages/admin/users/UserEditPage';

// --- PRODUCT MANAGEMENT ---
import ProductListPage from '../pages/admin/products/ProductListPage';
import ProductCreatePage from '../pages/admin/products/ProductCreatePage';
import ProductEditPage from '../pages/admin/products/ProductEditPage';

// --- ORDER MANAGEMENT ---
import OrderListPage from '../pages/admin/orders/OrderListPage';
import OrderDetailPage from '../pages/admin/orders/OrderDetailPage';

// --- CATEGORY MANAGEMENT ---
import CategoryListPage from '../pages/admin/categories/CategoryListPage';
import CategoryCreatePage from '../pages/admin/categories/CategoryCreatePage';
import CategoryEditPage from '../pages/admin/categories/CategoryEditPage';

// --- BRAND MANAGEMENT ---
import BrandListPage from '../pages/admin/brands/BrandListPage';
import BrandCreatePage from '../pages/admin/brands/BrandCreatePage';
import BrandEditPage from '../pages/admin/brands/BrandEditPage';

// --- INVENTORY ---
import InventoryListPage from '../pages/admin/inventory/InventoryListPage';
import InventoryUpdatePage from '../pages/admin/inventory/InventoryUpdatePage';

// --- COUPONS ---
import CouponListPage from '../pages/admin/coupon/CouponListPage';
import CouponFormPage from '../pages/admin/coupon/CouponFormPage'; // Dùng chung cho Create/Edit

// --- OTHERS ---
import ReportDashboard from '../pages/admin/report/ReportDashboard';
import SystemConfigPage from '../pages/admin/config/SystemConfigPage';
import ReviewManagementPage from '../pages/admin/reviews/ReviewManagementPage';
import CmsPage from '../pages/admin/cms/CmsPage';

function AdminRoutes() {
    return (
        <Routes>
            {/* Bảo vệ toàn bộ routes bên trong */}
            <Route element={<PrivateRoute />}>
                <Route element={<AdminLayout />}>

                    {/* Redirect mặc định về dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />
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

                    {/* INVENTORY */}
                    <Route path="inventory" element={<InventoryListPage />} />
                    <Route path="inventory/edit/:variantId" element={<InventoryUpdatePage />} />

                    {/* COUPONS */}
                    <Route path="coupons" element={<CouponListPage />} />
                    <Route path="coupons/create" element={<CouponFormPage />} />
                    <Route path="coupons/edit/:id" element={<CouponFormPage />} />

                    {/* REPORTS & CONFIG */}
                    <Route path="reports" element={<ReportDashboard />} />
                    <Route path="config" element={<SystemConfigPage />} />
                    <Route path="reviews" element={<ReviewManagementPage />} />
                    <Route path="cms" element={<CmsPage />} />


                </Route>
            </Route>

            {/* Fallback cho Admin */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
}

export default AdminRoutes;