import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../components/layout/UserLayout';
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';
import UserLoginPage from '../pages/UserLoginPage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<UserLoginPage />} />
      <Route element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/user" replace />} />
    </Routes>
  );
};

export default UserRoutes;



