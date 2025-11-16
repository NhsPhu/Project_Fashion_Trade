// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext'; // (Đã sửa ở lượt trước)
import { useNavigate, Link, useLocation } from 'react-router-dom';

const { Title } = Typography;

function LoginPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const { login, requires2FA } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy trang trước đó (nếu bị điều hướng)
    const from = location.state?.from?.pathname || null;

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const result = await login(
                requires2FA ? null : values.email,
                requires2FA ? null : values.password,
                requires2FA ? values.totpCode : null
            );

            // Nếu API yêu cầu 2FA, chỉ hiển thị thông báo
            if (result.requires2FA) {
                message.info('Vui lòng nhập mã 2FA từ ứng dụng');
            } else {
                // Đăng nhập thành công
                message.success('Đăng nhập thành công!');

                // 1. SỬA LỖI THEO YÊU CẦU:
                // Luôn điều hướng về Trang chủ (/)

                // Ngoại lệ: Nếu user bị đá ra từ một trang (ví dụ: /profile)
                // thì đưa họ quay lại trang đó.
                if (from && from !== '/' && !from.startsWith('/admin')) {
                    navigate(from, { replace: true });
                } else {
                    // Mặc định, TẤT CẢ user (kể cả admin) đều về trang chủ
                    navigate('/', { replace: true });
                }
            }
        } catch (err) {
            message.error(err.message || 'Đăng nhập thất bại');
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
                    <Title level={2} style={{ color: '#1890ff' }}>Fashion</Title>
                    <Title level={5} type="secondary">Đăng nhập</Title>
                </div>

                <Form form={form} onFinish={onFinish} layout="vertical">
                    {!requires2FA ? (
                        <>
                            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item name="totpCode" label="Mã Xác thực 2FA" rules={[{ required: true, len: 6, message: 'Mã 2FA phải có 6 chữ số' }]}>
                            <Input.OTP length={6} size="large" style={{ width: '100%' }} />
                        </Form.Item>
                    )}

                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        {requires2FA ? 'Xác minh 2FA' : 'Đăng nhập'}
                    </Button>

                    {requires2FA && (
                        <Button type="link" block onClick={() => {
                            // Reload để reset trạng thái 2FA
                            window.location.reload();
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