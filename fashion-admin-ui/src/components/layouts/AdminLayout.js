// src/components/layouts/AdminLayout.js
import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    GiftOutlined,
    LogoutOutlined,
    BarChartOutlined,
    SettingOutlined,
    TeamOutlined,
    HomeOutlined,
    FileTextOutlined,
    MessageOutlined,
} from '@ant-design/icons';

// (Đã sửa ở lượt trước)
import { useAuth } from '../../contexts/AuthContext';

const { Header, Content, Sider } = Layout;

// (Menu items - giữ nguyên)
const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Tổng quan</Link> },
    { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: <Link to="/admin/orders">Đơn hàng</Link> },
    {
        key: 'products_group',
        icon: <ShoppingOutlined />,
        label: 'Sản phẩm',
        children: [
            { key: '/admin/products', label: <Link to="/admin/products">Tất cả sản phẩm</Link> },
            { key: '/admin/products/new', label: <Link to="/admin/products/new">Thêm sản phẩm mới</Link> },
            { key: '/admin/categories', label: <Link to="/admin/categories">Danh mục</Link> },
            { key: '/admin/brands', label: <Link to="/admin/brands">Thương hiệu</Link> },
        ]
    },
    { key: '/admin/users', icon: <TeamOutlined />, label: <Link to="/admin/users">Người dùng</Link> },
    { key: '/admin/inventory', icon: <AppstoreOutlined />, label: <Link to="/admin/inventory">Tồn kho</Link> },
    { key: '/admin/coupons', icon: <GiftOutlined />, label: <Link to="/admin/coupons">Mã giảm giá</Link> },
    { key: '/admin/reports', icon: <BarChartOutlined />, label: <Link to="/admin/reports">Báo cáo</Link> },
    { key: '/admin/config', icon: <SettingOutlined />, label: <Link to="/admin/config">Cài đặt</Link> },
    { key: '/admin/reviews', icon: <MessageOutlined />, label: <Link to="/admin/reviews">Quản lý đánh giá</Link> },
    { key: '/admin/cms', icon: <FileTextOutlined />, label: <Link to="/admin/cms">CMS</Link> },

];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Điều hướng về trang login CHUNG
    };

    // 1. SỬA LỖI Ant Design: 'menu' phải là một object chứa 'items'
    const userMenu = {
        items: [
            { key: '1', label: 'Hồ sơ (Chưa có)', icon: <UserOutlined /> },
            { key: '2', label: <Link to="/">Xem trang chủ</Link>, icon: <HomeOutlined /> },
            { type: 'divider' },
            { key: '3', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout },
        ]
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible width={200}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: 'white', textAlign: 'center', lineHeight: '32px', borderRadius: 4 }}>
                    ADMIN
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={menuItems}
                    defaultSelectedKeys={['/admin/dashboard']}
                    selectedKeys={[location.pathname]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* 2. SỬA LỖI Ant Design: Dùng 'menu' thay vì 'overlay' */}
                    <Dropdown menu={userMenu} trigger={['click']}>
                        <Button type="text">
                            <Space>
                                <Avatar icon={<UserOutlined />} size="small" />
                                {user?.fullName || user?.email}
                            </Space>
                        </Button>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;