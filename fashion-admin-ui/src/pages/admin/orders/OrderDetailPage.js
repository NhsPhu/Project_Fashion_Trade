// src/pages/orders/OrderDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import OrderService from '../../../services/admin/OrderService';
import {
    Spin,
    Row,
    Col,
    Card,
    Typography,
    Descriptions,
    Table,
    Select,
    Button,
    Form,
    Input,
    notification,
    Tag
} from 'antd';

const { Text } = Typography;
const { Option } = Select;

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

function OrderDetailPage() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await OrderService.getOrderById(id);
            setOrder(data);
            form.setFieldsValue({
                orderStatus: data.orderStatus,
                payStatus: data.payStatus,
                trackingNumber: data.trackingNumber
            });
        } catch (err) {
            notification.error({ message: 'Lỗi tải đơn hàng', description: err.message });
        } finally {
            setLoading(false);
        }
    }, [id, form]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const handleUpdateStatus = async (values) => {
        setIsUpdating(true);
        try {
            await OrderService.updateOrderStatus(id, values);
            notification.success({ message: 'Cập nhật thành công!' });
            await fetchOrderDetails();
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
        } finally {
            setIsUpdating(false);
        }
    };

    const itemColumns = [
        { title: 'SKU', dataIndex: 'variantSku', key: 'sku' },
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'qty' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: formatCurrency },
        { title: 'Tổng', key: 'total', render: (_, record) => formatCurrency(record.price * record.quantity) },
    ];

    if (loading) return <Spin tip="Đang tải..." style={{ display: 'block', marginTop: 100 }} />;

    return (
        <Row gutter={24}>
            <Col span={16}>
                <Card title="Chi tiết đơn hàng" style={{ marginBottom: 24 }}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Mã đơn">{order.id}</Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt">{formatDate(order.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái ĐH">
                            <Tag color={order.orderStatus === 'Delivered' ? 'green' : 'orange'}>{order.orderStatus}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái TT">
                            <Tag color={order.payStatus === 'Paid' ? 'green' : 'volcano'}>{order.payStatus}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền" span={2}>
                            <Text strong style={{ fontSize: 18, color: '#cf1322' }}>{formatCurrency(order.totalAmount)}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Sản phẩm trong đơn">
                    <Table columns={itemColumns} dataSource={order.items} rowKey="variantSku" pagination={false} />
                </Card>
            </Col>

            <Col span={8}>
                <Card title="Cập nhật trạng thái" style={{ marginBottom: 24 }}>
                    <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                        <Form.Item name="orderStatus" label="Trạng thái ĐH" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Pending">Chờ xử lý</Option>
                                <Option value="Processing">Đang xử lý</Option>
                                <Option value="Shipped">Đã giao</Option>
                                <Option value="Delivered">Hoàn thành</Option>
                                <Option value="Cancelled">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="payStatus" label="Trạng thái Thanh toán" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Pending">Chờ thanh toán</Option>
                                <Option value="Paid">Đã thanh toán</Option>
                                <Option value="Refunded">Đã hoàn tiền</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="trackingNumber" label="Mã vận đơn">
                            <Input placeholder="Nhập mã vận đơn..." />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isUpdating} block>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="Thông tin Khách hàng" style={{ marginBottom: 24 }}>
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="Tên">{order.shippingName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{order.userEmail}</Descriptions.Item>
                        <Descriptions.Item label="SĐT">{order.shippingPhone}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Địa chỉ Giao hàng">
                    <p>
                        {order.shippingAddressLine}<br/>
                        {order.shippingDistrict}, {order.shippingCity}<br/>
                        {order.shippingProvince}
                    </p>
                </Card>
            </Col>
        </Row>
    );
}

export default OrderDetailPage;