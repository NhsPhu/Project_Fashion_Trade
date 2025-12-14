import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../../services/admin/ProductService';
import { Table, Button, Space, Image, Tag, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

function ProductListPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const paginationRef = useRef({ current: 1, pageSize: 10, total: 0 });

    const fetchProducts = useCallback(async () => {
        const { current, pageSize } = paginationRef.current;
        try {
            setLoading(true);
            setError(null);
            const springPage = current - 1;
            const data = await ProductService.getAllProducts(springPage, pageSize, "id,desc");

            setProducts(data.content);
            paginationRef.current = {
                current: data.number + 1,
                pageSize: data.size,
                total: data.totalElements,
            };
        } catch (err) {
            setError(err.message);
            message.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleTableChange = (newPagination) => {
        paginationRef.current.current = newPagination.current;
        paginationRef.current.pageSize = newPagination.pageSize;
        fetchProducts();
    };

    const handleDelete = async (id) => {
        try {
            await ProductService.deleteProduct(id);
            message.success('Đã xóa sản phẩm thành công!');
            fetchProducts();
        } catch (err) {
            message.error('Lỗi xóa sản phẩm: ' + err.message);
        }
    };

    const columns = [
        {
            title: 'Hình',
            dataIndex: 'defaultImage',
            key: 'defaultImage',
            width: 80,
            render: (url) => (
                url ? (
                    <Image
                        width={50}
                        height={50}
                        src={url}
                        // Nếu url bị lỗi thì hiện ảnh placeholder
                        fallback="https://placehold.co/50x50?text=No+Img"
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                ) : (
                    <div style={{ width: 50, height: 50, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '10px', color: '#999' }}>
                        No Img
                    </div>
                )
            )
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: 250 },
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price ? `${price.toLocaleString()} ₫` : '—'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Published') color = 'success';
                if (status === 'Draft') color = 'warning';
                if (status === 'Archived') color = 'error';
                return <Tag color={color}>{status?.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/products/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa sản phẩm?"
                        description="Hành động này sẽ chuyển trạng thái sang 'Lưu trữ'."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>Quản lý Sản phẩm</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/products/new')}>
                        Thêm mới
                    </Button>
                </div>

                {error && <p style={{ color: 'red' }}>Lỗi kết nối: {error}</p>}

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{
                        current: paginationRef.current.current,
                        pageSize: paginationRef.current.pageSize,
                        total: paginationRef.current.total,
                        showSizeChanger: true
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

export default ProductListPage;