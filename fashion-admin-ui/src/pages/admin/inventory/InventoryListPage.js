// src/pages/inventory/InventoryListPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Tag, notification, Space, Input, Tabs, Badge } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InventoryService from '../../../services/admin/InventoryService';

const InventoryListPage = () => {
    const [rawData, setRawData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Đổi sang API lấy TOÀN BỘ tồn kho (không chỉ lấy cảnh báo thấp)
                const response = await InventoryService.getAllInventory(); // sửa ở đây
                const list = Array.isArray(response) ? response : response.data || [];
                setRawData(list);
            } catch (error) {
                // Nếu chưa có API getAllInventory, fallback về getLowStock nhưng fix dữ liệu
                try {
                    const fallback = await InventoryService.getLowStock();
                    const list = Array.isArray(fallback) ? fallback : fallback.data || [];
                    setRawData(list);
                } catch (err) {
                    notification.error({
                        message: 'Lỗi tải dữ liệu tồn kho',
                        description: 'Không thể kết nối đến server',
                    });
                    setRawData([]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Tìm kiếm
    const searchedData = useMemo(() => {
        if (!searchValue.trim()) return rawData;
        const term = searchValue.toLowerCase();
        return rawData.filter(item =>
            (item.sku || '').toLowerCase().includes(term) ||
            (item.productName || '').toLowerCase().includes(term)
        );
    }, [rawData, searchValue]);

    // Nhóm theo kho + đếm số lượng cảnh báo thấp (≤10)
    const tabData = useMemo(() => {
        const lowStockItems = searchedData.filter(item => (item.currentStock || 0) <= 10);

        const byWarehouse = {};
        lowStockItems.forEach(item => {
            // Sửa key kho đúng 100%: dùng warehouseId trước, fallback về name
            const key = item.warehouseId === 1 ? 'Kho Hà Nội'
                : item.warehouseId === 2 ? 'Kho TP.HCM'
                    : item.warehouseId === 3 ? 'Kho Đà Nẵng'
                        : item.warehouseName || 'Không xác định';

            if (!byWarehouse[key]) byWarehouse[key] = [];
            byWarehouse[key].push(item);
        });

        return {
            allCount: lowStockItems.length,
            byWarehouse
        };
    }, [searchedData]);

    const currentData = activeTab === 'all'
        ? Object.values(tabData.byWarehouse).flat() // chỉ hiển thị cảnh báo thấp
        : tabData.byWarehouse[activeTab] || [];

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
                const color = s === 0 ? 'red' : s <= 3 ? 'volcano' : s <= 10 ? 'orange' : 'green';
                return <Tag color={color}>{s}</Tag>;
            },
        },
        {
            title: 'Kho',
            key: 'warehouse',
            render: (_, record) => {
                let name = 'Không xác định';
                if (record.warehouseId === 1) name = 'Kho Hà Nội';
                else if (record.warehouseId === 2) name = 'Kho TP.HCM';
                else if (record.warehouseId === 3) name = 'Kho Đà Nẵng';
                else if (record.warehouseName) name = record.warehouseName;

                return <Tag color="blue">{name}</Tag>;
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
                    onClick={() => navigate(`/admin/inventory/edit/${record.variantId}-${record.warehouseId}`)}
                >
                    Cập nhật
                </Button>
            ),
        },
    ];

    // Tạo tab động theo kho có dữ liệu
    const tabItems = [
        {
            key: 'all',
            label: (
                <span>
                    Tất cả kho
                    <Badge count={tabData.allCount} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                </span>
            ),
        },
        ...Object.keys(tabData.byWarehouse).sort().map(name => ({
            key: name,
            label: (
                <span>
                    {name}
                    <Badge count={tabData.byWarehouse[name].length} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
                </span>
            ),
        })),
    ];

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <h2>Quản lý tồn kho (Cảnh báo thấp)</h2>
                    <Space.Compact style={{ width: 400 }}>
                        <Input
                            placeholder="Tìm SKU hoặc tên sản phẩm..."
                            allowClear
                            size="large"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Space.Compact>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} type="card" />

                <Table
                    columns={columns}
                    dataSource={currentData}
                    rowKey={record => `${record.variantId}-${record.warehouseId}`}
                    loading={loading}
                    pagination={{ pageSize: 15, showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm` }}
                    scroll={{ x: 900 }}
                    locale={{ emptyText: 'Không có sản phẩm nào sắp hết hàng trong kho này' }}
                />
            </Space>
        </div>
    );
};

export default InventoryListPage;