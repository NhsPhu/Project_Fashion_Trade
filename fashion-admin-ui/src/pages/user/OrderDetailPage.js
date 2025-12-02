import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, message, Descriptions, Table, Tag } from 'antd';
import OrderService from '../../services/OrderService';

const { Title, Text } = Typography;

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await OrderService.getOrderDetail(id);
                setOrder(data);
            } catch (error) {
                message.error('Không thể tải chi tiết đơn hàng.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
    }

    if (!order) {
        return <Title level={3} style={{ textAlign: 'center', marginTop: '50px' }}>Không tìm thấy đơn hàng.</Title>;
    }

    const itemColumns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: (price) => `${price.toLocaleString('vi-VN')} ₫` },
        { title: 'Thành tiền', dataIndex: 'subtotal', key: 'subtotal', render: (price) => `${price.toLocaleString('vi-VN')} ₫` },
    ];

    // Tính toán tạm tính một cách an toàn
    const subtotal = order.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Chi tiết đơn hàng: {order.orderNo}</Title>
            
            <Card title="Thông tin người nhận" style={{ marginBottom: '20px' }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Họ tên">{order.shippingName}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{order.shippingPhone}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{`${order.shippingAddress}, ${order.shippingCity}`}</Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">{order.note || 'Không có'}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Thông tin đơn hàng" style={{ marginBottom: '20px' }}>
                 <Descriptions bordered column={1}>
                    <Descriptions.Item label="Ngày đặt">{new Date(order.orderDate).toLocaleString('vi-VN')}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn hàng">
                        <Tag color="blue">{order.orderStatus}</Tag>
                    </Descriptions.Item>
                     <Descriptions.Item label="Trạng thái thanh toán">
                        <Tag color={order.payStatus === 'PAID' ? 'green' : 'gold'}>{order.payStatus}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">{order.paymentMethod}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Các sản phẩm">
                {/* SỬA LỖI: Dùng order.items thay vì order.orderItems */}
                <Table 
                    columns={itemColumns}
                    dataSource={order.items}
                    rowKey="id"
                    pagination={false}
                />
                <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2em' }}>
                    <Text>Tạm tính: {subtotal.toLocaleString('vi-VN')} ₫</Text><br/>
                    <Text>Phí vận chuyển: {(order.shippingFee || 0).toLocaleString('vi-VN')} ₫</Text><br/>
                    <Title level={4}>Tổng cộng: {(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</Title>
                </div>
            </Card>
        </div>
    );
};

export default OrderDetailPage;
