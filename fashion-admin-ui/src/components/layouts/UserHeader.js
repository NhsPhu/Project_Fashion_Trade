// src/user/layout/UserHeader.js
import React, { useMemo } from 'react'; // Thêm useMemo
import { Badge, Button, Dropdown, Space, Avatar } from 'antd';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined, // Import icon Dashboard
} from '@ant-design/icons';

import { useUserAuth } from '../../contexts/UserAuthContext';
import { useUserCart } from '../../contexts/UserCartContext';
import './UserHeader.css';

const UserHeader = () => {
  const navigate = useNavigate();
  // Lấy thêm đối tượng 'user' từ context
  const { isAuthenticated, logout, user } = useUserAuth();
  const { cart } = useUserCart();

  const cartItemCount = cart?.totalItems ?? cart?.items?.length ?? 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Logic kiểm tra quyền Admin
  // (Dựa trên cách backend đặt tên role, ví dụ: ROLE_ADMIN, ROLE_SUPER_ADMIN,...)
  const isAdmin = useMemo(() => {
    if (!user) return false;
    // Kiểm tra trong danh sách roles (hoặc authorities)
    const roles = user.roles || user.authorities || [];

    // Nếu roles là chuỗi (ví dụ "ROLE_ADMIN,ROLE_USER")
    if (typeof roles === 'string') {
      return roles.includes('ADMIN') || roles.includes('MANAGER');
    }

    // Nếu roles là mảng
    if (Array.isArray(roles)) {
      return roles.some(r => r.includes('ADMIN') || r.includes('MANAGER'));
    }

    return false;
  }, [user]);

  const profileMenu = {
    items: [
      // 1. Nếu là Admin thì hiện thêm dòng này đầu tiên
      ...(isAdmin ? [{
        key: 'admin-dashboard',
        label: 'Trang quản trị',
        icon: <DashboardOutlined />,
        onClick: () => {
          // Dùng window.location.href để load lại toàn bộ trang Admin (tránh xung đột Router User/Admin)
          window.location.href = '/admin/dashboard';
        },
      }, { type: 'divider' }] : []),

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
        <Link to="/" className="user-logo">
          THE FASHION HOUSE
        </Link>

        <nav className="user-nav-menu">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/wishlist">Yêu thích</NavLink>
          <NavLink to="/categories">Chuyên mục</NavLink>
          <NavLink to="/brands">Thương hiệu</NavLink>
        </nav>

        <Space size={24} className="user-action-group">
          <Button type="text" icon={<HeartOutlined style={{ fontSize: 22 }} />} onClick={() => navigate('/wishlist')} />

          <Button type="text" onClick={() => navigate('/cart')}>
            <Badge count={cartItemCount} size="small" overflowCount={99} offset={[0, 2]}>
              <ShoppingCartOutlined style={{ fontSize: 26 }} />
            </Badge>
          </Button>

          {isAuthenticated ? (
              <Dropdown menu={profileMenu} placement="bottomRight" arrow>
                <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Hiển thị tên user nếu có */}
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span className="hide-on-mobile">
                            {user?.sub || user?.fullName || 'Tài khoản'}
                        </span>
                  </Space>
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