// src/pages/user/ProfilePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Input, Button, List, Tag, Table, Tabs, message, Typography, Avatar } from 'antd';
import { UserOutlined, ShoppingOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

// --- SỬA LỖI TẠI ĐÂY ---
// SAI: import { useAuth } from '../../contexts/AuthContext';
// ĐÚNG:
import { useUserAuth } from '../../contexts/UserAuthContext';
// ------------------------

import UserProfileService from '../../services/user/UserProfileService';

const { Title } = Typography;

const ProfilePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // --- SỬA LỖI TẠI ĐÂY ---
    // SAI: const { logout } = useAuth();
    // ĐÚNG:
    const { logout, user } = useUserAuth();
    // ------------------------

    const activeTab = searchParams.get('tab') || 'info';
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form] = Form.useForm();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Đảm bảo UserProfileService đã có hàm getMyOrders như hướng dẫn trước
            const [p, addr, ord] = await Promise.all([
                UserProfileService.getProfile(),
                UserProfileService.getAddresses(),
                UserProfileService.getMyOrders()
            ]);

            setProfile(p);
            setAddresses(addr);
            setOrders(ord || []);

            form.setFieldsValue({
                fullName: p.fullName,
                phone: p.phone,
                email: p.email
            });
        } catch (e) {
            console.error("Lỗi tải profile", e);
        } finally {
            setLoading(false);
        }
    }, [form]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleUpdateProfile = async (values) => {
        try {
            await UserProfileService.updateProfile(values);
            message.success('Cập nhật thành công!');
            loadData();
        } catch (e) {
            message.error('Lỗi cập nhật');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ... (Phần render các Tab giữ nguyên như code tôi gửi trước đó)
    // Để ngắn gọn, tôi chỉ hiển thị phần thay đổi logic chính ở trên.
    // Bạn hãy dùng lại phần return và renderTabs của phiên bản trước.

    // NẾU BẠN CẦN CODE RENDER ĐẦY ĐỦ, HÃY COPY ĐOẠN DƯỚI ĐÂY VÀO SAU handleLogout:

    const renderInfo = () => (
        <Card bordered={false}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Avatar size={100} icon={<UserOutlined />} src={profile.avatar} />
                <h3 style={{ marginTop: 10 }}>{profile.fullName}</h3>
                <Tag color="blue">Thành viên</Tag>
            </div>
            <Form layout="vertical" form={form} onFinish={handleUpdateProfile}>
                <Form.Item label="Email" name="email"><Input disabled /></Form.Item>
                <Form.Item label="Họ tên" name="fullName" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Số điện thoại" name="phone"><Input /></Form.Item>
                <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
            </Form>
        </Card>
    );

    const renderOrders = () => {
        const columns = [
            { title: 'Mã đơn', dataIndex: 'orderNo', key: 'orderNo' },
            { title: 'Ngày đặt', dataIndex: 'createdAt', render: t => new Date(t).toLocaleDateString('vi-VN') },
            { title: 'Tổng tiền', dataIndex: 'finalAmount', render: t => `${t?.toLocaleString()} đ` },
            { title: 'Trạng thái', dataIndex: 'orderStatus', render: s => <Tag>{s}</Tag> },
        ];
        return <Table dataSource={orders} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />;
    };

    const renderAddresses = () => (
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={addresses}
            renderItem={item => (
                <List.Item>
                    <Card title={item.name} size="small" extra={item.isDefault ? <Tag color="green">Mặc định</Tag> : null}>
                        <p><b>SĐT:</b> {item.phone}</p>
                        <p><b>Địa chỉ:</b> {item.addressLine}, {item.district}, {item.city}</p>
                    </Card>
                </List.Item>
            )}
        />
    );

    const items = [
        { key: 'info', label: <span><UserOutlined /> Cá nhân</span>, children: renderInfo() },
        { key: 'orders', label: <span><ShoppingOutlined /> Đơn hàng</span>, children: renderOrders() },
        { key: 'addresses', label: <span><EnvironmentOutlined /> Địa chỉ</span>, children: renderAddresses() },
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '20px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={2}>Tài khoản của tôi</Title>
                <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
            </div>
            <Card loading={loading}>
                <Tabs activeKey={activeTab} onChange={(key) => setSearchParams({ tab: key })} items={items} />
            </Card>
        </div>
    );
};

export default ProfilePage;