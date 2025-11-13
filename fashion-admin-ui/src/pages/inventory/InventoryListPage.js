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
                console.log('Low stock data:', data); // DEBUG
                setInventory(data || []);
                setFiltered(data || []);
            } catch (error) {
                console.error('Lỗi tải tồn kho:', error);
                notification.error({
                    message: 'Lỗi tải dữ liệu',
                    description: error.response?.data?.message || error.message
                });
                setInventory([]);
                setFiltered([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (value) => {
        const lower = value.toLowerCase();
        const filteredData = inventory.filter(item =>
            (item.sku || '').toLowerCase().includes(lower) ||
            (item.productName || '').toLowerCase().includes(lower) ||
            (item.warehouseName || '').toLowerCase().includes(lower)
        );
        setFiltered(filteredData);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'variantId',
            key: 'variantId',
            width: 60
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            render: (text) => text || 'N/A'
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (text) => text || 'N/A'
        },
        {
            title: 'Tồn kho',
            dataIndex: 'currentStock',
            key: 'currentStock',
            width: 100,
            render: (stock) => {
                let color = 'green';
                if (stock <= 3) color = 'red';
                else if (stock <= 5) color = 'orange';
                else if (stock <= 8) color = 'gold';
                return <Tag color={color}>{stock}</Tag>;
            },
        },
        {
            title: 'Kho',
            dataIndex: 'warehouseName',
            key: 'warehouseName',
            render: (text) => <Tag color="blue">{text || 'N/A'}</Tag>
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
                    <h2>Quản lý tồn kho (Cảnh báo thấp)</h2>
                    <Search
                        placeholder="Tìm SKU, sản phẩm hoặc kho..."
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
                    locale={{ emptyText: 'Không có sản phẩm nào sắp hết kho' }}
                    pagination={{ pageSize: 10 }}
                />
            </Space>
        </div>
    );
};

export default InventoryListPage;