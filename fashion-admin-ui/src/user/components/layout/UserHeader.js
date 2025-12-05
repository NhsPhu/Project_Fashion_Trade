// src/user/layout/UserHeader.js   (hoặc src/layout/UserHeader.js)

import React from 'react';
import { Badge, Button, Dropdown, Space } from 'antd';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { useUserAuth } from '../../contexts/UserAuthContext';
import { useUserCart } from '../../contexts/UserCartContext';
import './UserHeader.css';

const UserHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUserAuth();
  const { cart } = useUserCart();

  // QUAN TRỌNG: Chỉ đếm số loại sản phẩm (không đếm tổng quantity)
  const cartItemCount = cart?.totalItems ?? cart?.items?.length ?? 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileMenu = {
    items: [
      {
        key: 'profile',
        label: 'Hồ sơ cá nhân',
        icon: <UserOutlined />,
        onClick: () => navigate('/profile'),
      },
      {
        key: 'orders',
        label: 'Lịch sử đơn hàng',
        icon: <ShoppingCartOutlined />,
        onClick: () => navigate('/profile?tab=orders'),
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
      <header className="user-header">
        {/* Logo */}
        <Link to="/" className="user-logo">
          THE FASHION HOUSE
        </Link>

        {/* Menu chính */}
        <nav className="user-nav-menu">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/wishlist">Yêu thích</NavLink>
          <NavLink to="/categories">Chuyên mục</NavLink>
          <NavLink to="/brands">Thương hiệu</NavLink>
        </nav>

        {/* Các icon bên phải */}
        <Space size={24} className="user-action-group">
          {/* Yêu thích */}
          <Button type="text" icon={<HeartOutlined style={{ fontSize: 22 }} />} onClick={() => navigate('/wishlist')} />

          {/* Giỏ hàng – badge đúng yêu cầu */}
          <Button type="text" onClick={() => navigate('/cart')}>
            <Badge count={cartItemCount} size="small" overflowCount={99} offset={[0, 2]}>
              <ShoppingCartOutlined style={{ fontSize: 26 }} />
            </Badge>
          </Button>

          {/* Tài khoản */}
          {isAuthenticated ? (
              <Dropdown menu={profileMenu} placement="bottomRight" arrow>
                <Button type="text" icon={<UserOutlined style={{ fontSize: 22 }} />}>
                  Tài khoản
                </Button>
              </Dropdown>
          ) : (
              <Space size={12}>
                <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  Đăng ký
                </Button>
              </Space>
          )}
        </Space>
      </header>
  );
};

export default UserHeader;