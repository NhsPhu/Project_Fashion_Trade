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
            setCoupons(data || []);
            setFiltered(data || []);
        } catch (error) {
            notification.error({
                message: 'Lỗi tải danh sách',
                description: 'Không thể kết nối đến server'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        const lower = value.toLowerCase();
        const filteredData = coupons.filter(c =>
            c.code?.toLowerCase().includes(lower) ||
            c.type?.toLowerCase().includes(lower)
        );
        setFiltered(filteredData);
    };

    const handleDelete = async (id) => {
        try {
            await CouponService.delete(id);
            notification.success({
                message: 'Thành công!',
                description: 'Xóa mã giảm giá thành công'
            });
            fetchCoupons(); // Reload lại danh sách
        } catch (error) {
            let desc = 'Có lỗi xảy ra khi xóa mã giảm giá';
            if (error.response?.status === 403) {
                desc = 'Bạn không có quyền xóa. Vui lòng kiểm tra role ADMIN trong database.';
            } else if (error.response?.status === 400 || error.response?.status === 409) {
                desc = error.response?.data?.message || 'Mã giảm giá đang được sử dụng, không thể xóa';
            } else if (error.response?.status === 404) {
                desc = 'Không tìm thấy mã giảm giá';
            }
            notification.error({
                message: 'Xóa thất bại',
                description: desc
            });
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        { title: 'Loại', dataIndex: 'type', key: 'type', width: 120 },
        {
            title: 'Giá trị',
            key: 'value',
            render: (_, record) => {
                if (record.type === 'PERCENT') return <strong>{record.value}%</strong>;
                if (record.type === 'FREE_SHIPPING') return 'Miễn phí vận chuyển';
                return <strong>₫{Number(record.value).toLocaleString('vi-VN')}</strong>;
            },
        },
        {
            title: 'Tổng đơn tối thiểu',
            dataIndex: 'minOrderValue',
            render: (val) => val ? `₫${Number(val).toLocaleString('vi-VN')}` : 'Không giới hạn',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
        },
        {
            title: 'Lượt dùng',
            render: (_, record) => `${record.usedCount || 0}/${record.usageLimit}`,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => {
                const now = new Date();
                const start = record.startDate ? new Date(record.startDate) : null;
                const end = record.endDate ? new Date(record.endDate) : null;

                const isInDateRange = start && end ? (now >= start && now <= end) : true;
                const isWithinUsageLimit = (record.usedCount || 0) < record.usageLimit;

                const isActive = isInDateRange && isWithinUsageLimit;

                return (
                    <Tag color={isActive ? 'green' : 'red'}>
                        {isActive ? 'Hoạt động' : 'Hết hạn'}
                    </Tag>
                );
            },
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
                        title="Xóa mã giảm giá?"
                        description={`Bạn chắc chắn muốn xóa mã "${record.code}"? Hành động này không thể hoàn tác.`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <h2 style={{ margin: 0 }}>Quản lý mã giảm giá</h2>
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
                            size="large"
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
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    locale={{ emptyText: 'Chưa có mã giảm giá nào' }}
                />
            </Space>
        </div>
    );
};

export default CouponListPage;