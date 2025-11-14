// src/user/pages/ProfilePage.js

import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Input, Button, Row, Col, List, Switch, message, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import UserProfileService from '../../services/user/UserProfileService';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useUserAuth();
  const navigate = useNavigate();

  // BỌC load TRONG useCallback
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await UserProfileService.getProfile();
      form.setFieldsValue({ fullName: p.fullName, phone: p.phone, avatar: p.avatar });
      const addr = await UserProfileService.getAddresses();
      setAddresses(addr);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [form]); // Thêm form vào dependency

  // ĐÃ THÊM load VÀO DEPENDENCY
  useEffect(() => {
    load();
  }, [load]);

  const onSave = async (values) => {
    await UserProfileService.updateProfile(values);
    message.success('Đã cập nhật hồ sơ');
    await load();
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login'); // ĐÚNG ĐƯỜNG DẪN
  };

  return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <Title level={2}>Hồ sơ của tôi</Title>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card title="Thông tin cá nhân" loading={loading}>
              <Form layout="vertical" form={form} onFinish={onSave}>
                <Form.Item name="fullName" label="Họ tên">
                  <Input />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input />
                </Form.Item>
                <Form.Item name="avatar" label="Avatar URL">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Lưu</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Địa chỉ" loading={loading}>
              <List
                  dataSource={addresses}
                  renderItem={(addr) => (
                      <List.Item>
                        <List.Item.Meta
                            title={`${addr.name} - ${addr.phone}`}
                            description={`${addr.addressLine}, ${addr.district}, ${addr.city}, ${addr.province}`}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>Mặc định</span>
                          <Switch checked={addr.isDefault} disabled />
                        </div>
                      </List.Item>
                  )}
              />
            </Card>
          </Col>
        </Row>

        {/* NÚT ĐĂNG XUẤT */}
        <Space style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
          <Button
              type="danger"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
          >
            Đăng xuất
          </Button>
        </Space>
      </div>
  );
};

export default ProfilePage;