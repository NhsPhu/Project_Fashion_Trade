import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, Typography, List, Avatar, Row, Col, Tag, Divider, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import OrderService from '../../services/user/OrderService';

const { Title, Text } = Typography;

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const data = await OrderService.getOrderDetail(orderId);
                setOrder(data);
            } catch (error) {
                message.error('Không thể tải chi tiết đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
    }

    if (!order) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}>Không tìm thấy đơn hàng.</div>;
    }

    const getStatusTag = (status) => {
        const statusMap = {
            PENDING: { color: 'orange', text: 'Chờ xác nhận' },
            PROCESSING: { color: 'processing', text: 'Đang xử lý' },
            SHIPPING: { color: 'blue', text: 'Đang giao hàng' },
            DELIVERED: { color: 'success', text: 'Đã giao hàng' },
            CANCELLED: { color: 'error', text: 'Đã hủy' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <Link to="/user/profile#activity" style={{ marginBottom: 16, display: 'inline-block' }}>
                <ArrowLeftOutlined /> Quay lại Lịch sử hoạt động
            </Link>
            <Title level={2}>Chi tiết đơn hàng #{order.id}</Title>

            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Text strong>Mã đơn hàng:</Text> #{order.id}
                    </Col>
                    <Col span={12}>
                        <Text strong>Trạng thái:</Text> {getStatusTag(order.status)}
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={12}>
                        <Text strong>Ngày đặt:</Text> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </Col>
                    <Col span={12}>
                        <Text strong>Tổng tiền:</Text> <Text style={{ color: 'red', fontWeight: 'bold' }}>{(order.totalAmount || 0).toLocaleString('vi-VN')} ₫</Text>
                    </Col>
                </Row>
                <Divider />
                <Title level={4}>Sản phẩm đã mua</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={order.items}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar shape="square" size={64} src={item.product?.imageUrl} />}
                                title={<Link to={`/products/${item.product?.id}`}>{item.product?.name}</Link>}
                                description={`Số lượng: ${item.quantity} - Giá: ${(item.price || 0).toLocaleString('vi-VN')} ₫`}
                            />
                        </List.Item>
                    )}
                />
                <Divider />
                <Title level={4}>Thông tin giao hàng</Title>
                <p><Text strong>Địa chỉ:</Text> {order.shippingAddress?.fullAddress || 'N/A'}</p>
                <p><Text strong>Phương thức thanh toán:</Text> {order.paymentMethod || 'N/A'}</p>
            </Card>
        </div>
    );
};

export default OrderDetailPage;