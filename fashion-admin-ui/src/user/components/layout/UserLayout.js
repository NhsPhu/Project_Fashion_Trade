import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, Badge, Space, Avatar } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';

import { useUserCart } from '../../contexts/UserCartContext';
import { useUserAuth } from '../../contexts/UserAuthContext';

import './UserLayout.css';

const { Header, Content, Footer } = Layout;

const UserLayout = () => {
    const { cart } = useUserCart();
    const { isAuthenticated, user } = useUserAuth();

    // SỬA: dùng cart.items
    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    return (
        <Layout className="user-layout">
            <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <Link to="/user" style={{ fontSize: 20, fontWeight: 'bold', color: '#d4380d' }}>
                        THE FASHION HOUSE
                    </Link>

                    <Menu mode="horizontal" style={{ border: 0, flex: 1, justifyContent: 'center' }}>
                        <Menu.Item key="home"><Link to="/user">Home</Link></Menu.Item>
                        <Menu.Item key="products"><Link to="/user/products">Sản phẩm</Link></Menu.Item>
                        <Menu.Item key="wishlist"><Link to="/user/wishlist">Yêu thích</Link></Menu.Item>
                        <Menu.Item key="categories"><Link to="/user/categories">Chuyên mục</Link></Menu.Item>
                        <Menu.Item key="brands"><Link to="/user/brands">Cửa hàng</Link></Menu.Item>
                    </Menu>

                    <Space size="large">
                        <Badge count={cartCount}>
                            <Link to="/user/cart"><ShoppingCartOutlined style={{ fontSize: 24 }} /></Link>
                        </Badge>
                        <Link to="/user/wishlist"><HeartOutlined style={{ fontSize: 24 }} /></Link>
                        {isAuthenticated ? (
                            <Link to="/user/profile"><Avatar icon={<UserOutlined />} /></Link>
                        ) : (
                            <Link to="/user/login">Tài khoản</Link>
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