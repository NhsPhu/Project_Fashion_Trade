// src/user/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, notification, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useAuth } from '../../contexts/AuthContext';
import { useUserAuth } from '../../contexts/UserAuthContext';

const { Title, Text } = Typography;

// Giải mã JWT
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);
    const navigate = useNavigate();

    const { login: adminLogin } = useAuth();
    const { login: userLogin } = useUserAuth();

    const onFinish = async (values) => {
        setLoading(true);
        setPageError(null);

        try {
            const data = await userLogin(values.email, values.password);
            const token = data.accessToken || data.token;

            if (!token) throw new Error('Không nhận được token.');

            const decoded = parseJwt(token);
            const roles = decoded?.roles || '';

            if (
                roles.includes('SUPER_ADMIN') ||
                roles.includes('PRODUCT_MANAGER') ||
                roles.includes('ORDER_MANAGER')
            ) {
                await adminLogin(values.email, values.password);
                notification.success({
                    message: 'Xin chào Quản trị viên',
                    description: 'Đăng nhập Admin thành công'
                });
                navigate('/admin/dashboard');
            } else {
                notification.success({
                    message: 'Đăng nhập thành công',
                    description: 'Chúc bạn mua sắm vui vẻ!'
                });
                navigate('/');
            }

        } catch (err) {
            let errorMsg = 'Email hoặc mật khẩu không đúng.';

            if (err.response?.status === 401) {
                errorMsg = 'Sai Email hoặc Mật khẩu!';
            } else if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }

            setPageError(errorMsg);

            notification.error({
                message: 'Đăng nhập thất bại',
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = () => {
        notification.warning({
            message: 'Thiếu thông tin',
            description: 'Vui lòng nhập đầy đủ Email và Mật khẩu'
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2}>Đăng nhập</Title>
                    <Text type="secondary">Fashion Shop</Text>
                </div>

                {loading && (
                    <Alert
                        message="Đang đăng nhập..."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {pageError && (
                    <Alert
                        message="Đăng nhập không thành công"
                        description={pageError}
                        type="error"
                        showIcon
                        closable
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form
                    layout="vertical"
                    size="large"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text>Chưa có tài khoản? </Text>
                        <Link to="/register"><b>Đăng ký</b></Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;
