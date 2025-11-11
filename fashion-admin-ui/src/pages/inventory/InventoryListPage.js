// src/pages/inventory/InventoryListPage.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, notification, Input, Space } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InventoryService from '../../services/InventoryService';

const { Search } = Input;

const InventoryListPage = () => {
    const [inventory, setInventory] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await InventoryService.getLowStock();
                // SẮP XẾP: Đỏ → Vàng → Xanh
                const sorted = data.sort((a, b) => {
                    const daysA = getDaysLeft(a.expiryDate);
                    const daysB = getDaysLeft(b.expiryDate);
                    return daysA - daysB; // Gần hết hạn trước
                });
                setInventory(sorted);
                setFiltered(sorted);
            } catch (error) {
                notification.error({ message: 'Lỗi', description: error.message });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Tính số ngày còn lại
    const getDaysLeft = (dateStr) => {
        const expiry = new Date(dateStr);
        const today = new Date();
        const diff = expiry - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    // Xác định màu theo ngày
    const getExpiryColor = (daysLeft) => {
        if (daysLeft <= 30) return 'red';
        if (daysLeft <= 365) return 'gold'; // Trong năm
        return 'green';
    };

    const handleSearch = (value) => {
        const lower = value.toLowerCase();
        const filteredData = inventory.filter(item =>
            item.sku.toLowerCase().includes(lower) ||
            item.productName.toLowerCase().includes(lower)
        );
        setFiltered(filteredData);
    };

    const columns = [
        { title: 'ID', dataIndex: 'variantId', key: 'variantId', width: 60 },
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
        {
            title: 'Tồn kho',
            dataIndex: 'currentStock',
            key: 'currentStock',
            width: 100,
            render: (stock) => (
                <Tag color={stock <= 3 ? 'red' : stock <= 5 ? 'orange' : 'green'}>
                    {stock}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/admin/inventory/edit/${record.variantId}`)}
                >
                    Cập nhật
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Quản lý tồn kho (Tất cả sản phẩm)</h2>
                    <Search
                        placeholder="Tìm SKU hoặc tên sản phẩm..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        style={{ width: 400 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="variantId"
                    loading={loading}
                    locale={{ emptyText: 'Không có sản phẩm nào' }}
                    pagination={{ pageSize: 10 }}
                />
            </Space>
        </div>
    );
};

export default InventoryListPage;