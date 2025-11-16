// pages/wishlists/WishlistListPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistService from '../../../services/user/WishlistService';
import { Table, Button, Space, Typography, notification, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const WishlistListPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const fetchData = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res = await WishlistService.getAllWishlists(page - 1, size);
            setData(res.content || []);
            setPagination({
                current: res.number + 1,
                pageSize: res.size,
                total: res.totalElements
            });
        } catch (err) {
            notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { title: 'User ID', dataIndex: ['user', 'id'], key: 'userId' },
        { title: 'Email', dataIndex: ['user', 'email'], key: 'email' },
        { title: 'Họ tên', dataIndex: ['user', 'fullName'], key: 'fullName' },
        { title: 'Số sản phẩm', dataIndex: 'itemCount', key: 'count' },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: active => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Hoạt động' : 'Ẩn'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/wishlists/${record.user?.id}`)}
                    >
                        Xem chi tiết
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Quản lý Wishlist Người dùng</Title>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={record => record.user?.id || Math.random()}
                pagination={pagination}
                loading={loading}
                onChange={pg => fetchData(pg.current, pg.pageSize)}
                bordered
            />
        </div>
    );
};

export default WishlistListPage;