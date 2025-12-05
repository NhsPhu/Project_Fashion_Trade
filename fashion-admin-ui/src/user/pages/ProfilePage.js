// src/user/pages/ProfilePage.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  List,
  Switch,
  message,
  Typography,
  Space,
  Tabs,
  Tag,
  Modal,
  Divider,
  Tooltip,
} from 'antd';
import {
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  StarOutlined,
} from '@ant-design/icons';
import UserProfileService from '../../services/user/UserProfileService';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activity, setActivity] = useState({ orders: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { logout } = useUserAuth();
  const navigate = useNavigate();

  // BỌC load TRONG useCallback
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, addressData, activityData] = await Promise.all([
        UserProfileService.getProfile(),
        UserProfileService.getAddresses(),
        UserProfileService.getActivity(),
      ]);
      setProfile(profileData);
      form.setFieldsValue({
        fullName: profileData.fullName,
        phone: profileData.phone,
        avatar: profileData.avatar,
        email: profileData.email,
      });
      setAddresses(addressData);
      setActivity(activityData);
    } catch (e) {
      message.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  }, [form]);

  // ĐÃ THÊM load VÀO DEPENDENCY
  useEffect(() => {
    load();
  }, [load]);

  const onSave = async (values) => {
    const payload = {
      fullName: values.fullName,
      phone: values.phone,
      avatar: values.avatar,
    };
    await UserProfileService.updateProfile(payload);
    message.success('Đã cập nhật hồ sơ');
    await load();
  };

  const openCreateAddress = () => {
    setEditingAddress(null);
    addressForm.resetFields();
    addressForm.setFieldsValue({
      defaultShipping: !addresses.some(addr => addr.defaultShipping),
      defaultBilling: !addresses.some(addr => addr.defaultBilling),
    });
    setAddressModalOpen(true);
  };

  const openEditAddress = (address) => {
    setEditingAddress(address);
    addressForm.setFieldsValue({
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      district: address.district,
      province: address.province,
      postalCode: address.postalCode,
      defaultShipping: address.defaultShipping,
      defaultBilling: address.defaultBilling,
    });
    setAddressModalOpen(true);
  };

  const submitAddress = async () => {
    try {
      const values = await addressForm.validateFields();
      if (editingAddress) {
        await UserProfileService.updateAddress(editingAddress.id, values);
        message.success('Đã cập nhật địa chỉ');
      } else {
        await UserProfileService.addAddress(values);
        message.success('Đã thêm địa chỉ');
      }
      setAddressModalOpen(false);
      setEditingAddress(null);
      await load();
    } catch (e) {
      if (e?.errorFields) return;
      message.error(e?.response?.data || 'Không thể lưu địa chỉ');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    Modal.confirm({
      title: 'Xóa địa chỉ',
      content: 'Bạn có chắc muốn xóa địa chỉ này?',
      okType: 'danger',
      onOk: async () => {
        await UserProfileService.deleteAddress(addressId);
        message.success('Đã xóa địa chỉ');
        await load();
      },
    });
  };

  const handleSetDefault = async (address, type) => {
    const payload = {
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      district: address.district,
      province: address.province,
      postalCode: address.postalCode,
      defaultShipping: type === 'shipping' ? true : address.defaultShipping,
      defaultBilling: type === 'billing' ? true : address.defaultBilling,
    };
    await UserProfileService.updateAddress(address.id, payload);
    await load();
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login'); // ĐÚNG ĐƯỜNG DẪN
  };

  return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <Title level={2}>Hồ sơ của tôi</Title>
        <Tabs
          defaultActiveKey="info"
          items={[
            {
              key: 'info',
              label: 'Thông tin cá nhân',
              children: (
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Card title="Thông tin cơ bản" loading={loading}>
                      <Form layout="vertical" form={form} onFinish={onSave}>
                        <Form.Item name="fullName" label="Họ tên">
                          <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                          <Input disabled />
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
                    <Card
                      title="Địa chỉ giao hàng & thanh toán"
                      loading={loading}
                      extra={
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateAddress}>
                          Thêm địa chỉ
                        </Button>
                      }
                    >
                      <List
                        dataSource={addresses}
                        locale={{ emptyText: 'Chưa có địa chỉ' }}
                        renderItem={(addr) => (
                          <List.Item
                            actions={[
                              <Tooltip title="Chỉnh sửa" key="edit">
                                <Button size="small" icon={<EditOutlined />} onClick={() => openEditAddress(addr)} />
                              </Tooltip>,
                              <Tooltip title="Xóa" key="delete">
                                <Button
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteAddress(addr.id)}
                                />
                              </Tooltip>,
                            ]}
                          >
                            <List.Item.Meta
                              title={
                                <Space>
                                  <span>{addr.name} - {addr.phone}</span>
                                  {addr.defaultShipping && <Tag icon={<HomeOutlined />} color="green">Ship mặc định</Tag>}
                                  {addr.defaultBilling && <Tag icon={<ShoppingOutlined />} color="blue">Thanh toán</Tag>}
                                </Space>
                              }
                              description={
                                <>
                                  <div>{addr.addressLine}</div>
                                  <div>{addr.district}, {addr.city}, {addr.province}</div>
                                  {addr.postalCode && <div>Mã bưu chính: {addr.postalCode}</div>}
                                </>
                              }
                            />
                            <Space direction="vertical">
                              <Button
                                size="small"
                                type={addr.defaultShipping ? 'primary' : 'default'}
                                onClick={() => handleSetDefault(addr, 'shipping')}
                              >
                                Đặt ship mặc định
                              </Button>
                              <Button
                                size="small"
                                type={addr.defaultBilling ? 'primary' : 'default'}
                                onClick={() => handleSetDefault(addr, 'billing')}
                              >
                                Đặt thanh toán
                              </Button>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'activity',
              label: 'Lịch sử hoạt động',
              children: (
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Card title="Đơn hàng gần đây" loading={loading}>
                      <List
                        dataSource={activity.orders || []}
                        locale={{ emptyText: 'Chưa có đơn hàng' }}
                        renderItem={(order) => (
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <Space>
                                  <HistoryOutlined />
                                  <span>ĐH #{order.id}</span>
                                  <Tag color="purple">{order.status}</Tag>
                                </Space>
                              }
                              description={
                                <div>
                                  <div>Tổng: {(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</div>
                                  <div>Ngày tạo: {order.createdAt}</div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Đánh giá của bạn" loading={loading}>
                      <List
                        dataSource={activity.reviews || []}
                        locale={{ emptyText: 'Chưa có đánh giá' }}
                        renderItem={(review) => (
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <Space>
                                  <StarOutlined style={{ color: '#faad14' }} />
                                  <span>{review.productName}</span>
                                  <Tag color="gold">{review.rating}★</Tag>
                                </Space>
                              }
                              description={
                                <>
                                  <div>{review.body}</div>
                                  <div>Trạng thái: <Tag>{review.status}</Tag></div>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />

        <Divider />

        <Space style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
          <Button
              type="default"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
          >
            Đăng xuất
          </Button>
        </Space>

        <Modal
          title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
          open={addressModalOpen}
          onCancel={() => {
            setAddressModalOpen(false);
            setEditingAddress(null);
          }}
          onOk={submitAddress}
          okText="Lưu"
        >
          <Form layout="vertical" form={addressForm}>
            <Form.Item name="name" label="Người nhận" rules={[{ required: true, message: 'Nhập tên người nhận' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Điện thoại" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="addressLine" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="district" label="Quận/Huyện">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="Thành phố/Tỉnh">
              <Input />
            </Form.Item>
            <Form.Item name="province" label="Quốc gia/Tỉnh khác">
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label="Mã bưu chính">
              <Input />
            </Form.Item>
            <Form.Item name="defaultShipping" label="Đặt làm địa chỉ giao hàng mặc định" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="defaultBilling" label="Đặt làm địa chỉ thanh toán mặc định" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default ProfilePage;