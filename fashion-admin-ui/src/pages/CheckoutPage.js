import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Card, message } from 'antd';
import { useUserCart } from '../contexts/UserCartContext';
import OrderService from '../services/OrderService';

const CheckoutPage = () => {
    const { cart, clearCartFrontendOnly } = useUserCart(); 
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            const orderData = {
                shippingName: values.shippingName,
                shippingPhone: values.shippingPhone,
                shippingAddress: values.shippingAddress,
                shippingCity: values.shippingCity || 'TP.HCM',
                note: values.note,
                paymentMethod: 'COD'
            };

            const newOrder = await OrderService.checkout(orderData);
            
            // DEBUG: In ra dữ liệu đơn hàng nhận được từ backend
            console.log('DEBUG: Dữ liệu đơn hàng nhận được:', newOrder);

            clearCartFrontendOnly(); 
            
            navigate('/order-success', { state: { order: newOrder } });
            
            message.success(`Đơn hàng ${newOrder.orderNo} đã được tạo thành công!`);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi tạo đơn hàng.';
            message.error(errorMessage);
            console.error("Lỗi chi tiết:", error.response?.data || error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Row gutter={24}>
                <Col xs={24} md={14}>
                    <Card title="Thông tin giao hàng">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item name="shippingName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="shippingPhone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="shippingAddress" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="shippingCity" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="note" label="Ghi chú">
                                <Input.TextArea />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={isLoading} block>
                                Xác nhận đặt hàng
                            </Button>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} md={10}>
                    <Card title="Tóm tắt đơn hàng">
                        {cart.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>{item.productName} (x{item.quantity})</span>
                                <span>{item.subtotal.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        ))}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tạm tính:</span>
                            <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Phí vận chuyển:</span>
                            <span>{shippingFee.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em' }}>
                            <span>Tổng cộng:</span>
                            <span>{total.toLocaleString('vi-VN')} ₫</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
