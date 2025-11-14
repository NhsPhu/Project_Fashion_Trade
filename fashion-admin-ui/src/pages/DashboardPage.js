// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Button, Spin, Tag, Space } from 'antd';
import { ShoppingCartOutlined, UserOutlined, PercentageOutlined, StockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReportService from '../services/ReportService';
import InventoryService from '../services/InventoryService';
import moment from 'moment';

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
                const [revenueRes, lowStockRes, customerRes] = await Promise.all([
                    ReportService.getRevenue('day', start, end),
                    InventoryService.getLowStock(),
                    ReportService.getCustomers(start, end)
                ]);

                setStats({
                    revenue: revenueRes.totalRevenue || 0,
                    totalOrders: revenueRes.totalOrders || 0,
                    newCustomers: customerRes.newCustomers || 0,
                    lowStockCount: lowStockRes.length || 0,
                    conversionRate: customerRes.conversionRate || 0
                });

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

    return (
        <div>
            {loading ? <Spin size="large" style={{ display: 'block', margin: '100px auto' }} /> : (
                <>
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Doanh thu 7 ngày"
                                    value={stats.revenue}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix="₫"
                                    formatter={(value) => value.toLocaleString()}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Tổng đơn hàng" value={stats.totalOrders} prefix={<ShoppingCartOutlined />} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Khách mới" value={stats.newCustomers} prefix={<UserOutlined />} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Tỷ lệ chuyển đổi" value={stats.conversionRate} suffix="%" precision={2} />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Biểu đồ doanh thu & đơn hàng" style={{ marginBottom: 24 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip
                                    formatter={(value, name) =>
                                        [name === 'revenue' ? `₫${value.toLocaleString()}` : value,
                                            name === 'revenue' ? 'Doanh thu' : 'Đơn hàng']
                                    }
                                />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#cf1322" name="Doanh thu" strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3f8600" name="Đơn hàng" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Row gutter={16} style={{ marginTop: 24 }}>
                        <Col span={12}>
                            <Card title="Hành động nhanh">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button type="default" block icon={<PercentageOutlined />} onClick={() => navigate('/admin/coupons/create')}>
                                        Tạo mã giảm giá mới
                                    </Button>
                                    <Button type="default" block icon={<StockOutlined />} onClick={() => navigate('/admin/inventory')}>
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
                </>
            )}
        </div>
    );
}

export default DashboardPage;