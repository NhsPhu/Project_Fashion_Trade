import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TagsOutlined,
    AppstoreOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    StockOutlined, // ĐÃ THÊM
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Space, Avatar } from 'antd';

const { Header, Sider, Content } = Layout;

const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/products', icon: <ShoppingCartOutlined />, label: 'Quản lý Sản phẩm' },
    { key: '/admin/orders', icon: <AppstoreOutlined />, label: 'Quản lý Đơn hàng' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý Người dùng' },
    { key: '/admin/categories', icon: <TagsOutlined />, label: 'Quản lý Danh mục' },
    { key: '/admin/brands', icon: <TagsOutlined />, label: 'Quản lý Thương hiệu' },
    { key: '/admin/inventory', icon: <StockOutlined />, label: 'Quản lý hàng tồn kho' }, // ĐÃ THÊM
];

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const handleMenuClick = (e) => navigate(e.key);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ color: 'white', margin: 0 }}>
                        {collapsed ? 'F.A' : 'Fashion Admin'}
                    </h2>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>

            <Layout>
                <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16, width: 64, height: 64 }}
                    />
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <Button type="primary" danger onClick={logout}>Đăng xuất</Button>
                    </Space>
                </Header>

                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;