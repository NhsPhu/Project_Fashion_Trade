// src/layouts/AdminLayout.js
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
    StockOutlined,
    PercentageOutlined,
    BarChartOutlined, SettingOutlined, MessageOutlined, FileTextOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Space, Avatar, Badge } from 'antd';

const { Header, Sider, Content } = Layout;

const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/products', icon: <ShoppingCartOutlined />, label: 'Sản phẩm' },
    { key: '/admin/orders', icon: <AppstoreOutlined />, label: 'Đơn hàng' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Người dùng' },
    { key: '/admin/categories', icon: <TagsOutlined />, label: 'Danh mục' },
    { key: '/admin/brands', icon: <TagsOutlined />, label: 'Thương hiệu' },
    { key: '/admin/inventory', icon: <StockOutlined />, label: 'Tồn kho' },
    { key: '/admin/coupons', icon: <PercentageOutlined />, label: 'Mã giảm giá' },     // MỚI
    { key: '/admin/reports', icon: <BarChartOutlined />, label: 'Báo cáo' },
    { key: '/admin/config', icon: <SettingOutlined />, label: 'Cấu hình hệ thống' },
    { key: '/admin/reviews', icon: <MessageOutlined />, label: 'Quản lý đánh giá' },
    { key: '/admin/cms', icon: <FileTextOutlined />, label: 'CMS' },
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
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    margin: 16,
                    borderRadius: 8
                }}>
                    <h2 style={{ color: 'white', margin: 0, fontWeight: 600 }}>
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
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 18, width: 64, height: 64 }}
                    />
                    <Space>
                        <Badge count={3} size="small">
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                        </Badge>
                        <Button type="primary" danger onClick={logout}>
                            Đăng xuất
                        </Button>
                    </Space>
                </Header>

                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;