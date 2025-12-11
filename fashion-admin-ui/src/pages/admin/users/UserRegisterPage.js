import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import UserAuthService from '../../services/user/UserAuthService';

const { Title, Text } = Typography;

const UserRegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await UserAuthService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
      notification.success({
        message: 'Đăng ký thành công',
        description: 'Bạn có thể đăng nhập bằng tài khoản vừa tạo.',
      });
      navigate('/login');
    } catch (error) {
      notification.error({
        message: 'Đăng ký thất bại',
        description: error?.response?.data || error.message || 'Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f5f5f5', padding: 24 }}>
      <Card style={{ width: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 8 }}>Đăng ký tài khoản</Title>
          <Text type="secondary">Tạo tài khoản để trải nghiệm đầy đủ tính năng.</Text>
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email@domain.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="0123 456 789" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="•••••••" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="•••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Text>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </Text>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserRegisterPage;

