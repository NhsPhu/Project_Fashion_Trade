// src/pages/orders/OrderListPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../../services/admin/OrderService';
import { Table, Button, Space, Tag, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

function OrderListPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const paginationRef = useRef({ current: 1, pageSize: 10, total: 0 });

    const fetchOrders = useCallback(async () => {
        const { current, pageSize } = paginationRef.current;
        try {
            setLoading(true);
            setError(null);
            const springPage = current - 1;
            const data = await OrderService.getAllOrders(springPage, pageSize, "createdAt,desc");
            setOrders(data.content);
            paginationRef.current = {
                current: data.number + 1,
                pageSize: data.size,
                total: data.totalElements,
            };
        } catch (err) {
            setError(err.message || 'Lỗi tải đơn hàng');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleTableChange = (pag) => {
        paginationRef.current.current = pag.current;
        paginationRef.current.pageSize = pag.pageSize;
        fetchOrders();
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text) => text || 'Khách lẻ'  // SỬA: luôn hiển thị tên hoặc fallback
        },
        { title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt', render: formatDate },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', render: formatCurrency },
        {
            title: 'Trạng thái ĐH',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status) => {
                if (!status) return <Tag color="default">N/A</Tag>;
                const colorMap = { Pending: 'gold', Shipped: 'orange', Delivered: 'green', Cancelled: 'red' };
                return <Tag color={colorMap[status] || 'geekblue'}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Trạng thái TT',
            dataIndex: 'payStatus',
            key: 'payStatus',
            render: (status) => {
                if (!status) return <Tag color="default">N/A</Tag>;
                return <Tag color={status === 'Paid' ? 'green' : 'volcano'}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/admin/orders/${record.id}`)}>
                        Xem
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Quản lý Đơn hàng</Title>
                {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    pagination={{
                        current: paginationRef.current.current,
                        pageSize: paginationRef.current.pageSize,
                        total: paginationRef.current.total,
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </div>
    );
}

export default OrderListPage;