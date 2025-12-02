import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await OrderService.getMyOrders();
                setOrders(data);
            } catch (error) {
                message.error('Không thể tải danh sách đơn hàng.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusTag = (status) => {
        switch (status) {
            case 'PENDING': return <Tag color="orange">Chờ xử lý</Tag>;
            case 'PROCESSING': return <Tag color="blue">Đang xử lý</Tag>;
            case 'SHIPPED': return <Tag color="cyan">Đang giao</Tag>;
            case 'DELIVERED': return <Tag color="green">Đã giao</Tag>;
            case 'CANCELLED': return <Tag color="red">Đã hủy</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        { title: 'Mã đơn hàng', dataIndex: 'orderNo', key: 'orderNo' },
        { 
            title: 'Ngày đặt', 
            dataIndex: 'orderDate', 
            key: 'orderDate',
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalAmount', 
            key: 'totalAmount',
            render: (amount) => `${amount.toLocaleString('vi-VN')} ₫`
        },
        { 
            title: 'Trạng thái đơn hàng', 
            dataIndex: 'orderStatus', 
            key: 'orderStatus',
            render: getStatusTag
        },
        { 
            title: 'Trạng thái thanh toán', 
            dataIndex: 'payStatus', 
            key: 'payStatus',
            render: (status) => status === 'PAID' ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="gold">Chờ thanh toán</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Link to={`/user/orders/${record.id}`}>
                    <Button icon={<EyeOutlined />} />
                </Link>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Đơn hàng của tôi</Title>
            <Table 
                columns={columns} 
                dataSource={orders} 
                loading={loading} 
                rowKey="id"
            />
        </div>
    );
};

export default MyOrdersPage;
