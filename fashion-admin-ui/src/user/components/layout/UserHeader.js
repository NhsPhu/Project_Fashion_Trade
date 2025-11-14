import React from 'react';
import { Badge, Button, Dropdown, Layout, Menu, Space } from 'antd';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, HeartOutlined } from '@ant-design/icons';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { useUserCart } from '../../contexts/UserCartContext';
import './UserHeader.css';

const { Header } = Layout;

const UserHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUserAuth();
  const { cart } = useUserCart();

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  const profileMenu = {
    items: [
      {
        key: 'profile',
        label: 'Hồ sơ',
        icon: <UserOutlined />,
        onClick: () => navigate('/user/profile'),
      },
      {
        key: 'orders',
        label: 'Lịch sử đơn hàng',
        onClick: () => navigate('/user/profile?tab=orders'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header className="user-header">
      <Link to="/user" className="user-logo">THE FASHION HOUSE</Link>

      <nav className="user-nav-menu">
        <NavLink to="/user">Home</NavLink>
        <NavLink to="/user/products">Sản phẩm</NavLink>
        <NavLink to="/user/wishlist">Yêu thích</NavLink>
        <NavLink to="/user/about">Chuyên mục</NavLink>
        <NavLink to="/user/stores">Cửa hàng</NavLink>
      </nav>

      <Space size="middle" className="user-action-group">
        <Button type="link" onClick={() => navigate('/user/wishlist')} icon={<HeartOutlined />}>
          Yêu thích
        </Button>
        <Button type="link" onClick={() => navigate('/user/cart')}>
          <Badge count={cart?.totalItems || 0} size="small">
            <ShoppingCartOutlined style={{ fontSize: 20 }} />
          </Badge>
        </Button>
        {isAuthenticated ? (
          <Dropdown menu={profileMenu} placement="bottomRight">
            <Button icon={<UserOutlined />}>Tài khoản</Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/user/login')}>
            Đăng nhập
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default UserHeader;
