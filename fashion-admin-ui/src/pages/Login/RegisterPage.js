// src/user/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, notification, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import AuthService from '../../services/AuthService';

const { Title, Text } = Typography;

function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        setErrorMsg(null);

        try {
            await AuthService.register(values);

            setSuccessMsg('Đăng ký thành công! Đang chuyển sang trang đăng nhập...');

            notification.success({
                message: 'Đăng ký thành công',
                description: 'Bạn có thể đăng nhập ngay'
            });

            setTimeout(() => navigate('/login'), 1500);

        } catch (err) {
            let msg = 'Đăng ký thất bại. Vui lòng thử lại.';
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            }

            setErrorMsg(msg);

            notification.error({
                message: 'Đăng ký thất bại',
                description: msg
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 450 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2}>Đăng ký</Title>
                    <Text type="secondary">Tạo tài khoản mới</Text>
                </div>

                {successMsg && (
                    <Alert type="success" message={successMsg} showIcon style={{ marginBottom: 16 }} />
                )}

                {errorMsg && (
                    <Alert type="error" message={errorMsg} showIcon closable style={{ marginBottom: 16 }} />
                )}

                <Form layout="vertical" size="large" onFinish={onFinish}>
                    <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    return value === getFieldValue('password')
                                        ? Promise.resolve()
                                        : Promise.reject('Mật khẩu không khớp');
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng ký
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text>Đã có tài khoản? </Text>
                        <Link to="/login"><b>Đăng nhập</b></Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default RegisterPage;
