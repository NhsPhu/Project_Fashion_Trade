// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Typography, Button, Spin, Tag, Space } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, WarningOutlined, RiseOutlined, FallOutlined, PercentageOutlined, StockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReportService from '../services/ReportService';
import InventoryService from '../services/InventoryService';
import moment from 'moment';

const { Title } = Typography;

function DashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        revenue: 0,
        totalOrders: 0,
        newCustomers: 0,
        lowStockCount: 0,
        conversionRate: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const end = moment();
            const start = end.clone().subtract(6, 'days');

            try {
                const [revenueRes, lowStockRes] = await Promise.all([
                    ReportService.getRevenue('day', start, end),
                    InventoryService.getLowStock()
                ]);

                const revenue = revenueRes.totalRevenue || 0;
                const orders = revenueRes.totalOrders || 0;

                setStats(prev => ({
                    ...prev,
                    revenue,
                    totalOrders: orders,
                    lowStockCount: lowStockRes.length
                }));

                setChartData(revenueRes.breakdown.map(d => ({
                    name: moment(d.date).format('DD/MM'),
                    revenue: d.revenue,
                    orders: d.orders
                })));

            } catch (error) {
                console.error('Lỗi dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const cards = [
        {
            title: 'Doanh thu 7 ngày',
            value: stats.revenue,
            icon: <DollarOutlined />,
            color: '#cf1322',
            prefix: '₫',
            link: '/admin/reports'
        },
        {
            title: 'Tổng đơn hàng',
            value: stats.totalOrders,
            icon: <ShoppingCartOutlined />,
            color: '#3f8600',
            link: '/admin/orders'
        },
        {
            title: 'Khách hàng mới',
            value: stats.newCustomers,
            icon: <UserOutlined />,
            color: '#1890ff',
            link: '/admin/users'
        },
        {
            title: 'Tồn kho thấp',
            value: stats.lowStockCount,
            icon: <WarningOutlined />,
            color: '#fa8c16',
            link: '/admin/inventory',
            tag: stats.lowStockCount > 0 ? <Tag color="red">Cảnh báo</Tag> : null
        }
    ];

    return (
        <div>
            <Title level={2}>Chào mừng bạn đến với Dashboard</Title>
            <p style={{ color: '#666', marginBottom: 24 }}>
                Dưới đây là các số liệu thống kê thực tế:
            </p>

            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Đơn hàng"
                            value={10}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh thu (Đã giao)"
                            value={5897000}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<DollarOutlined />}
                            suffix=" VND"
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Khách hàng"
                            value={11}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={8}>
                    <Card>
                        {loading ? (
                            <Spin />
                        ) : (
                            <>
                                <Statistic
                                    title="Sản phẩm sắp hết hàng "
                                    value={stats.lowStockCount}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<WarningOutlined />}
                                />
                                <Button
                                    type="link"
                                    onClick={() => navigate('/admin/inventory')}
                                    style={{ padding: 0 }}
                                >
                                    Xem chi tiết →
                                </Button>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>

            <Card title="Doanh thu & Đơn hàng (7 ngày gần nhất)" style={{ marginTop: 24 }}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                            formatter={(value, name) => [
                                name === 'revenue' ? `₫${value.toLocaleString()}` : value,
                                name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                            ]}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#cf1322"
                            name="Doanh thu"
                            strokeWidth={2}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="orders"
                            stroke="#3f8600"
                            name="Đơn hàng"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* QUICK ACTIONS */}
            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="Hành động nhanh">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                type="default"
                                block
                                icon={<PercentageOutlined />}
                                onClick={() => navigate('/admin/coupons/create')}
                            >
                                Tạo mã giảm giá mới
                            </Button>
                            <Button
                                type="default"
                                block
                                icon={<StockOutlined />}
                                onClick={() => navigate('/admin/inventory')}
                            >
                                Cập nhật tồn kho
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Cảnh báo hệ thống">
                        {stats.lowStockCount > 0 ? (
                            <Tag color="red" style={{ fontSize: 14 }}>
                                {stats.lowStockCount} sản phẩm sắp hết hàng
                            </Tag>
                        ) : (
                            <Tag color="green">Tất cả tồn kho ổn định</Tag>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardPage;