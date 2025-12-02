// src/pages/inventory/InventoryListPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Tag, notification, Space, Input, Statistic, Card } from 'antd';
import { EditOutlined, SearchOutlined, AlertOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InventoryService from '../../../services/admin/InventoryService';

const InventoryListPage = () => {
    const [rawData, setRawData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let list = [];

                try {
                    const response = await InventoryService.getAllInventory();
                    list = Array.isArray(response) ? response : response.data || [];
                } catch (e) {}

                if (!list || list.length === 0) {
                    const fallback = await InventoryService.getLowStock();
                    list = Array.isArray(fallback) ? fallback : fallback.data || [];
                }

                // Chỉ giữ lại kho Hà Nội
                list = list.filter(item =>
                    item.warehouseName === 'Kho Hà Nội' ||
                    item.warehouseName?.includes('Hà Nội')
                );

                setRawData(list);
            } catch (err) {
                notification.error({
                    message: 'Lỗi tải dữ liệu tồn kho',
                    description: 'Không thể kết nối đến server',
                });
                setRawData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const searchedData = useMemo(() => {
        if (!searchValue.trim()) return rawData;
        const term = searchValue.toLowerCase();
        return rawData.filter(item =>
            (item.sku || '').toLowerCase().includes(term) ||
            (item.productName || '').toLowerCase().includes(term)
        );
    }, [rawData, searchValue]);

    const lowStockItems = searchedData.filter(item => (item.currentStock || 0) <= 10);
    const lowStockCount = lowStockItems.length;

    const columns = [
        { title: 'ID', dataIndex: 'variantId', key: 'variantId', width: 80 },
        { title: 'SKU', dataIndex: 'sku', key: 'sku', render: t => t || '—' },
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
        {
            title: 'Tồn kho',
            dataIndex: 'currentStock',
            key: 'currentStock',
            align: 'center',
            render: stock => {
                const s = stock || 0;
                let color = 'green';
                if (s === 0) color = 'red';
                else if (s <= 3) color = 'volcano';
                else if (s <= 10) color = 'orange';
                return <Tag color={color} style={{ minWidth: 42 }}>{s}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => navigate(`/admin/inventory/edit/${record.variantId}-1`)}
                >
                    Cập nhật
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f9f9f9', minHeight: '100vh' }}>
            {/* Header đẹp */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                    <AlertOutlined style={{ color: '#ff4d4f', marginRight: 12 }} />
                    Cảnh báo tồn kho thấp
                </h1>
            </div>

            {/* Card thống kê + tìm kiếm */}
            <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <Statistic
                        title={<span style={{ color: '#595959', fontSize: 16 }}>Số sản phẩm cần nhập gấp</span>}
                        value={lowStockCount}
                        prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
                        valueStyle={{ color: '#ff4d4f', fontSize: 36, fontWeight: 'bold' }}
                    />
                    <Space.Compact size="large" style={{ width: 420 }}>
                        <Input
                            placeholder="Tìm kiếm SKU hoặc tên sản phẩm..."
                            allowClear
                            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            style={{ height: 48, fontSize: 16 }}
                        />
                    </Space.Compact>
                </div>
            </Card>

            {/* Bảng dữ liệu */}
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={lowStockItems}
                    rowKey={record => record.variantId}
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                    }}
                    scroll={{ x: 800 }}
                    locale={{ emptyText: 'Tất cả sản phẩm đều đủ hàng' }}
                />
            </Card>
        </div>
    );
};

export default InventoryListPage;