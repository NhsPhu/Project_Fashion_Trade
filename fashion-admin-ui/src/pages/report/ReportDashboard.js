// src/pages/report/ReportDashboard.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Button, Table, Tag, Space } from 'antd';
import { DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportService from '../../services/ReportService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import InventoryService from '../../services/InventoryService'; // THÊM import này để lấy tồn kho thấp từ InventoryService

const { RangePicker } = DatePicker;

const ReportDashboard = () => {
    const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        const [start, end] = dateRange;
        try {
            const [rev, orders, top, low, customers] = await Promise.all([
                ReportService.getRevenue('day', start, end),
                ReportService.getOrders(start, end),
                ReportService.getTopProducts(5),
                InventoryService.getLowStock(), // SỬA: Sử dụng InventoryService.getLowStock() để lấy dữ liệu tồn kho thấp từ inventory table
                ReportService.getCustomers(start, end)
            ]);

            setRevenueData(rev.breakdown.map(d => ({
                date: moment(d.date).format('DD/MM'),
                revenue: d.revenue,
                orders: d.orders
            })));

            setTopProducts(top);
            setLowStock(low);

            setStats({
                revenue: rev.totalRevenue,
                totalOrders: rev.totalOrders,
                completed: orders.completed,
                cancelled: orders.cancelled,
                newCustomers: customers.newCustomers,
                conversion: customers.conversionRate
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const columnsTop = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'name' },
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        {
            title: 'Đã bán',
            dataIndex: 'soldQuantity',
            key: 'qty',
            render: qty => <Tag color="blue">{qty}</Tag>
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            render: val => `₫${val?.toLocaleString()}`
        },
    ];

    const columnsLow = [
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'name' },
        {
            title: 'Tồn kho',
            dataIndex: 'currentStock',
            render: stock => <Tag color={stock <= 3 ? 'red' : 'orange'}>{stock}</Tag>
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2><BarChartOutlined /> Báo cáo & Thống kê</h2>
                    <Space>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            format="DD/MM/YYYY"
                        />
                        <Button icon={<DownloadOutlined />}>Export PDF</Button>
                    </Space>
                </div>

                <Row gutter={16}>
                    <Col span={6}>
                        <Card loading={loading}>
                            <Statistic title="Doanh thu" value={stats.revenue} prefix="₫" precision={0} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card loading={loading}>
                            <Statistic title="Tổng đơn" value={stats.totalOrders} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card loading={loading}>
                            <Statistic title="Khách mới" value={stats.newCustomers} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card loading={loading}>
                            <Statistic title="Tỷ lệ chuyển đổi" value={stats.conversion} suffix="%" precision={2} />
                        </Card>
                    </Col>
                </Row>

                <Card title="Doanh thu theo ngày" loading={loading}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Đơn hàng" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Sản phẩm bán chạy" loading={loading}>
                            <Table
                                dataSource={topProducts}
                                columns={columnsTop}
                                pagination={false}
                                rowKey="productId"
                                onRow={(record) => ({
                                    onClick: () => navigate(`/admin/products/${record.productId}`)
                                })}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Tồn kho thấp" loading={loading}>
                            <Table
                                dataSource={lowStock}
                                columns={columnsLow}
                                pagination={false}
                                rowKey="variantId"
                            />
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default ReportDashboard;