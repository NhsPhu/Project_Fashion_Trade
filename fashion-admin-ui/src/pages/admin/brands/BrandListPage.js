// src/pages/brands/BrandListPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../../services/admin/BrandService';
import {
    Table,
    Button,
    Space,
    Typography,
    Popconfirm,
    notification
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

function BrandListPage() {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await BrandService.getAllBrands();
            setBrands(data);
        } catch (err) {
            setError(err.message);
            notification.error({ message: 'Lỗi tải thương hiệu', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (id) => {
        try {
            await BrandService.deleteBrand(id);
            notification.success({ message: 'Xóa thương hiệu thành công.' });
            fetchBrands();
        } catch (err) {
            notification.error({ message: 'Lỗi khi xóa thương hiệu', description: err.message });
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/brands/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa thương hiệu?"
                        description="Bạn có chắc muốn xóa thương hiệu này?"
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
                <Title level={2}>Quản lý Thương hiệu</Title>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}
                    onClick={() => navigate('/admin/brands/new')}
                >
                    Thêm thương hiệu mới
                </Button>

                {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

                <Table
                    columns={columns}
                    dataSource={brands}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    loading={loading}
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </div>
    );
}

export default BrandListPage;