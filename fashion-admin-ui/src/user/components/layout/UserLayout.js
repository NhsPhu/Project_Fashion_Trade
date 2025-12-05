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
            </Footer>
        </Layout>
    );
};

export default UserLayout;