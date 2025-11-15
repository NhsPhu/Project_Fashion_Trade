// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

function LoginPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const result = await login(
                show2FA ? null : values.email,
                show2FA ? null : values.password,
                show2FA ? values.totpCode : null
            );

            if (result.requires2FA) {
                setShow2FA(true);
                message.info('Nhập mã 2FA từ ứng dụng');
            } else {
                message.success('Đăng nhập thành công!');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Card style={{ width: 420, borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#1890ff' }}>Fashion Admin</Title>
                    <Title level={5} type="secondary">Đăng nhập quản trị</Title>
                </div>

                <Form form={form} onFinish={onFinish} layout="vertical">
                    {!show2FA ? (
                        <>
                            <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item name="totpCode" rules={[{ required: true, len: 6 }]}>
                            <Input.OTP length={6} size="large" />
                        </Form.Item>
                    )}

                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        {show2FA ? 'Xác minh 2FA' : 'Đăng nhập'}
                    </Button>

                    {show2FA && (
                        <Button type="link" block onClick={() => {
                            setShow2FA(false);
                            form.resetFields();
                        }}>
                            Quay lại
                        </Button>
                    )}

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;