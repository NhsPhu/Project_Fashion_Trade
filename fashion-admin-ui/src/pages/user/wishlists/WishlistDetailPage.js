// pages/wishlists/WishlistDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WishlistService from '../../../services/user/WishlistService';
import { Table, Button, Space, Image, Typography, Popconfirm, notification, Spin } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const WishlistDetailPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const data = await WishlistService.getWishlistByUserId(userId);
            setWishlist(data);
        } catch (err) {
            notification.error({ message: 'Lỗi tải wishlist', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [userId]);

    const handleRemove = async (itemId) => {
        try {
            await WishlistService.removeItem(itemId);
            notification.success({ message: 'Đã xóa khỏi wishlist' });
            fetchWishlist();
        } catch (err) {
            notification.error({ message: 'Xóa thất bại', description: err.message });
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: ['product', 'defaultImage'],
            key: 'image',
            render: img => <Image src={img || 'https://via.placeholder.com/60'} width={60} />
        },
        { title: 'Tên sản phẩm', dataIndex: ['product', 'name'], key: 'name' },
        {
            title: 'Giá',
            dataIndex: ['product', 'basePrice'],
            key: 'price',
            render: p => p ? `${p.toLocaleString()} VND` : 'N/A'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Xóa sản phẩm khỏi wishlist?"
                    description="Hành động này không thể hoàn tác."
                    onConfirm={() => handleRemove(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </Popconfirm>
            )
        }
    ];

    if (loading) return <Spin tip="Đang tải..." fullscreen />;

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </Space>

            <Title level={3}>Wishlist của User ID: {userId}</Title>
            {wishlist?.user && (
                <p style={{ margin: '8px 0', fontSize: 16 }}>
                    <strong>Email:</strong> {wishlist.user.email} |
                    <strong> Họ tên:</strong> {wishlist.user.fullName || 'N/A'}
                </p>
            )}

            <Table
                columns={columns}
                dataSource={wishlist?.items || []}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                locale={{ emptyText: 'Wishlist trống' }}
            />
        </div>
    );
};

export default WishlistDetailPage;