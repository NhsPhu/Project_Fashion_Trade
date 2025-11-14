import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

const { Title } = Typography;

const UserLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useUserAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/user');
    } catch (e) {
      message.error('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 380 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Đăng nhập</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu' }]}> 
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Đăng nhập</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserLoginPage;



