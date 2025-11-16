// src/pages/coupon/CouponListPage.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Input, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CouponService from '../../../services/admin/CouponService';

const { Search } = Input;

const CouponListPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await CouponService.getAll();
            setCoupons(data);
            setFiltered(data);
        } catch (error) {
            notification.error({ message: 'Lỗi', description: 'Không thể tải danh sách mã giảm giá' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        const lower = value.toLowerCase();
        const filteredData = coupons.filter(c =>
            c.code.toLowerCase().includes(lower) ||
            c.type.toLowerCase().includes(lower)
        );
        setFiltered(filteredData);
    };

    const handleDelete = async (id) => {
        try {
            await CouponService.delete(id);
            notification.success({ message: 'Xóa mã giảm giá thành công!' });
            fetchCoupons();
        } catch (error) {
            notification.error({ message: 'Xóa thất bại', description: error.message });
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            render: (code) => <Tag color="blue">{code}</Tag>
        },
        { title: 'Loại', dataIndex: 'type', key: 'type' },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            render: (value, record) =>
                record.type === 'PERCENT' ? `${value}%` : `₫${value?.toLocaleString()}`
        },
        {
            title: 'Tổng đơn tối thiểu',
            dataIndex: 'minOrderValue',
            render: (val) => val ? `₫${val.toLocaleString()}` : 'Không'
        },
        {
            title: 'Hạn dùng',
            dataIndex: 'endDate',
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Lượt dùng',
            dataIndex: 'usedCount',
            render: (used, record) => `${used}/${record.usageLimit}`
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Hoạt động' : 'Dừng'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/coupons/edit/${record.id}`)}
                    />
                    <Popconfirm
                        title="Xóa mã này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Quản lý mã giảm giá</h2>
                    <Space>
                        <Search
                            placeholder="Tìm mã hoặc loại..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/admin/coupons/create')}
                        >
                            Tạo mã mới
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Chưa có mã giảm giá nào' }}
                />
            </Space>
        </div>
    );
};

export default CouponListPage;