// src/user/pages/CheckoutPage.js

import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Card,
    Table,
    Space,
    Typography,
    message,
    Divider,
    Row,
    Col,
} from 'antd';
import { useUserCart } from '../../contexts/UserCartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const { cart, clearCart } = useUserCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Kiểm tra giỏ hàng
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, textAlign: 'center' }}>
                <Title level={2}>Thanh toán</Title>
                <p style={{ fontSize: 18, color: '#999' }}>
                    Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.
                </p>
                <Button type="primary" onClick={() => navigate('/cart')}>
                    Quay lại giỏ hàng
                </Button>
            </div>
        );
    }

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Giả lập gọi API đặt hàng
            await new Promise((resolve) => setTimeout(resolve, 1500));

            message.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
            clearCart();
            navigate('/order-success');
        } catch (error) {
            message.error('Đặt hàng thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <img
                        src={record.productImage}
                        alt={record.productName}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div>
                        <div>{record.productName}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            SKU: {record.variantSku}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'currentPrice',
            render: (v) => `${v.toLocaleString()} ₫`,
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            width: 80,
            align: 'center',
        },
        {
            title: 'Tạm tính',
            dataIndex: 'subtotal',
            render: (v) => <Text strong>{v.toLocaleString()} ₫</Text>,
        },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <Title level={2}>Thanh toán</Title>

            <Row gutter={24}>
                {/* Cột trái: Form thông tin */}
                <Col xs={24} lg={16}>
                    <Card title="Thông tin giao hàng" style={{ marginBottom: 24 }}>
                        <Form layout="vertical" onFinish={onFinish} initialValues={{ paymentMethod: 'cod' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                    >
                                        <Input size="large" placeholder="Nguyễn Văn A" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
                                        ]}
                                    >
                                        <Input size="large" placeholder="0901234567" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="address"
                                label="Địa chỉ nhận hàng"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input.TextArea rows={2} placeholder="Số nhà, đường, phường/xã..." />
                            </Form.Item>

                            <Form.Item name="note" label="Ghi chú (tùy chọn)">
                                <Input.TextArea rows={2} placeholder="Ví dụ: Giao giờ hành chính..." />
                            </Form.Item>

                            <Divider />

                            <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                                <Radio.Group
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                >
                                    <Space direction="vertical">
                                        <Radio value="cod">
                                            <strong>Thanh toán khi nhận hàng (COD)</strong>
                                        </Radio>
                                        <Radio value="bank" disabled>
                                            Chuyển khoản ngân hàng <Text type="secondary">(Sắp ra mắt)</Text>
                                        </Radio>
                                        <Radio value="momo" disabled>
                                            Ví MoMo <Text type="secondary">(Sắp ra mắt)</Text>
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Button size="large" onClick={() => navigate('/cart')}>
                                        Quay lại giỏ hàng
                                    </Button>
                                    <Button type="primary" size="large" htmlType="submit" loading={loading}>
                                        Xác nhận đặt hàng
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Cột phải: Tóm tắt đơn hàng */}
                <Col xs={24} lg={8}>
                    <Card title="Tóm tắt đơn hàng">
                        <Table
                            dataSource={cart.items.map((i) => ({ ...i, key: i.id }))}
                            columns={columns}
                            pagination={false}
                            showHeader={false}
                            size="small"
                            summary={() => (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={3}>
                                            <Text strong>Tổng cộng</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <Text strong style={{ color: '#d4380d' }}>
                                                {cart.totalAmount.toLocaleString()} ₫
                                            </Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    {paymentMethod === 'cod' && (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell colSpan={4}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Bạn sẽ thanh toán khi nhận hàng.
                                                </Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    )}
                                </>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;