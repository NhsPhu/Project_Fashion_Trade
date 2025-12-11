<<<<<<< HEAD
// src/user/layout/UserLayout.js  ← TẠO MỚI FILE NÀY

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import UserHeader from './UserHeader';
import './UserLayout.css'; // giữ lại nếu bạn muốn style cho content/footer

const { Content, Footer } = Layout;

const UserLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <UserHeader />
            <Content style={{ padding: '0 0', background: '#fff' }}>
                <Outlet />
            </Content>
            <Footer className="user-footer" style={{ textAlign: 'center', background: '#f0f0f0' }}>
                THE FASHION HOUSE © 2025 - All rights reserved
=======
// src/components/layouts/UserLayout.js
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge, Space, Avatar, Button, Dropdown } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, UserOutlined, LogoutOutlined, AppstoreAddOutlined } from '@ant-design/icons';

// (Đảm bảo các đường dẫn Context này là chính xác)
import { useUserCart } from '../../contexts/UserCartContext';
// 1. SỬA LỖI: Import hook 'useAuth' HỢP NHẤT
import { useAuth } from '../../contexts/AuthContext';

import './UserLayout.css'; // (Tệp CSS mới)

const { Header, Content, Footer } = Layout;

// TẤT CẢ LINKS ĐÃ SỬA (bỏ /user/)
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

    // Lấy context an toàn (Fix lỗi crash loop)
    const cartContext = useUserCart();
    // 2. SỬA LỖI: Dùng hook 'useAuth' HỢP NHẤT
    const authContext = useAuth();

    const cart = cartContext ? cartContext.cart : null;
    const isAuthenticated = authContext ? authContext.isAuthenticated : false;
    const user = authContext ? authContext.user : null; // Lấy user
    const logout = authContext ? authContext.logout : () => {};

    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // 3. SỬA LỖI: Kiểm tra vai trò từ 'user' HỢP NHẤT
    // (userType cũng có thể dùng nếu bạn đã sửa AuthContext)
    const isAdmin = user?.roles?.some(role =>
        role === 'SUPER_ADMIN' ||
        role ==='PRODUCT_MANAGER' ||
        role === 'ORDER_MANAGER'
    );

    // Menu cho User đã đăng nhập (Dropdown)
    const profileMenu = {
        items: [
            { key: 'profile', label: 'Hồ sơ', icon: <UserOutlined />, onClick: () => navigate('/profile') },
            { key: 'orders', label: 'Lịch sử đơn hàng', onClick: () => navigate('/profile?tab=orders') },
            // (Thêm link Admin nếu có quyền)
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

                    {/* SỬA LINKS VÀ HIỆN MENU TÀI KHOẢN */}
                    <Space size="middle" className="user-action-group">
                        <Link to="/wishlist" className="user-action-icon"><HeartOutlined /></Link>
                        <Link to="/cart" className="user-action-icon">
                            <Badge count={cartCount} size="small">
                                <ShoppingCartOutlined />
                            </Badge>
                        </Link>

                        {isAuthenticated ? (
                            // Nếu đã đăng nhập: Hiển thị Dropdown "Xin chào..."
                            <Dropdown menu={profileMenu} placement="bottomRight" trigger={['click']}>
                                <Button type="text" style={{ padding: 0 }}>
                                    <Space>
                                        <Avatar icon={<UserOutlined />} size="small" />
                                        Xin chào, {user?.fullName || user?.email}
                                    </Space>
                                </Button>
                            </Dropdown>
                        ) : (
                            // Nếu chưa đăng nhập: Hiển thị nút "Đăng nhập" (Link /login)
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
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
            </Footer>
        </Layout>
    );
};

export default UserLayout;