import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { useAuth } from '../hooks/useAuth';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await login(values.email, values.password);
        } catch (err) {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: err.message || 'Sai email hoặc mật khẩu.',
            });
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}>Đăng nhập Admin</Title>
                </div>

                <Form
                    name="admin_login"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    {/* 2. THÊM LIÊN KẾT ĐĂNG KÝ */}
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;