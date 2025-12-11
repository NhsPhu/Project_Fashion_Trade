import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 1. SỬA: Import service HỢP NHẤT
import AuthService from '../services/AuthService';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook để điều hướng

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const registerData = {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                phone: values.phone
            };

            // 2. SỬA: Gọi hàm register từ service HỢP NHẤT
            await AuthService.register(registerData);

            notification.success({
                message: 'Đăng ký thành công!',
                description: 'Bạn bây giờ có thể đăng nhập bằng tài khoản vừa tạo.',
            });

            // 3. Tự động chuyển về trang Đăng nhập
            navigate('/login');

        } catch (err) {
            notification.error({
                message: 'Đăng ký thất bại',
                description: err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
            });
            setLoading(false);
        }
    };

    return (
        // ... (Toàn bộ phần JSX của Form giữ nguyên y hệt file gốc) ...
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 450 }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}>Tạo tài khoản</Title>
                </div>

                <Form
                    name="customer_register"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Họ và Tên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận Mật khẩu"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận Mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Link to="/login">Đã có tài khoản? Đăng nhập ngay</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default RegisterPage;