// src/components/layouts/UserLayout.js
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge, Space, Avatar, Button, Dropdown } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, UserOutlined, LogoutOutlined, AppstoreAddOutlined, HistoryOutlined } from '@ant-design/icons';

import { useUserCart } from '../../contexts/UserCartContext';
import { useAuth } from '../../contexts/AuthContext';

import './UserLayout.css';

const { Header, Content, Footer } = Layout;

const menuItems = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/products', label: <Link to="/products">Sản phẩm</Link> },
    { key: '/wishlist', label: <Link to="/wishlist">Yêu thích</Link> },
    { key: '/categories', label: <Link to="/categories">Chuyên mục</Link> },
    { key: '/brands', label: <Link to="/brands">Cửa hàng</Link> },
];

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cartContext = useUserCart();
    const authContext = useAuth();

    const cart = cartContext ? cartContext.cart : null;
    const isAuthenticated = authContext ? authContext.isAuthenticated : false;
    const user = authContext ? authContext.user : null;
    const logout = authContext ? authContext.logout : () => {};

    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.roles?.some(role =>
        role === 'SUPER_ADMIN' ||
        role ==='PRODUCT_MANAGER' ||
        role === 'ORDER_MANAGER'
    );

    // Menu cho User đã đăng nhập (Dropdown)
    const profileMenu = {
        items: [
            { key: 'profile', label: 'Hồ sơ', icon: <UserOutlined />, onClick: () => navigate('/profile') },
            // SỬA LỖI: Điều hướng đến trang /user/orders
            { key: 'orders', label: 'Đơn hàng của tôi', icon: <HistoryOutlined />, onClick: () => navigate('/user/orders') },
            
            ...(isAdmin ?
                [
                    { type: 'divider' },
                    { key: 'admin_dashboard', label: 'Quản lý (Admin)', icon: <AppstoreAddOutlined />, onClick: () => navigate('/admin/dashboard') }
                ] : []),
            { type: 'divider' },
            { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout },
        ],
    };

    return (
        <Layout className="user-layout">
            <Header className="user-header">
                <div className="user-header-container">

                    <Link to="/" className="user-logo">
                        THE FASHION HOUSE
                    </Link>

                    <Menu
                        mode="horizontal"
                        className="user-nav-menu"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                    />

                    <Space size="middle" className="user-action-group">
                        <Link to="/wishlist" className="user-action-icon"><HeartOutlined /></Link>
                        <Link to="/cart" className="user-action-icon">
                            <Badge count={cartCount} size="small">
                                <ShoppingCartOutlined />
                            </Badge>
                        </Link>

                        {isAuthenticated ? (
                            <Dropdown menu={profileMenu} placement="bottomRight" trigger={['click']}>
                                <Button type="text" style={{ padding: 0 }}>
                                    <Space>
                                        <Avatar icon={<UserOutlined />} size="small" />
                                        Xin chào, {user?.fullName || user?.email}
                                    </Space>
                                </Button>
                            </Dropdown>
                        ) : (
                            <Button type="primary" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </Button>
                        )}
                    </Space>
                </div>
            </Header>

            <Content className="user-content">
                <Outlet />
            </Content>

            <Footer className="user-footer">
                THE FASHION HOUSE 2025 - All rights reserved
            </Footer>
        </Layout>
    );
};

export default UserLayout;
