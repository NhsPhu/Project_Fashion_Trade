// src/pages/products/ProductListPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import { Table, Button, Space, Image, Tag, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

function ProductListPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // DÙNG useRef ĐỂ LƯU pagination
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
        } finally {
            setLoading(false);
        }
    }, []);

    // CHỈ PHỤ THUỘC fetchProducts → KHÔNG CÒN WARNING
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
            alert('Xóa (lưu trữ) sản phẩm thành công!');
            fetchProducts();
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    const columns = [
        {
            title: 'Hình',
            dataIndex: 'defaultImage',
            key: 'defaultImage',
            render: (defaultImage) =>
                defaultImage ?
                    <Image width={50} src={`/images/products/${defaultImage}`} alt="product" />
                    : '—'
        },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => price ? `₫${price.toLocaleString()}` : '—' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Published' ? 'green' : 'red'}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/products/edit/${record.id}`)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa sản phẩm?"
                        description="Bạn có chắc muốn xóa (lưu trữ) sản phẩm này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
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
                <Title level={2}>Quản lý Sản phẩm</Title>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => navigate('/admin/products/new')}>
                    Thêm sản phẩm mới
                </Button>
                {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{
                        current: paginationRef.current.current,
                        pageSize: paginationRef.current.pageSize,
                        total: paginationRef.current.total,
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    bordered
                />
            </Space>
        </div>
    );
}

export default ProductListPage;