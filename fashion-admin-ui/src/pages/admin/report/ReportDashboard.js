// src/pages/report/ReportDashboard.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Button, Table, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportService from '../../../services/admin/ReportService';
import InventoryService from '../../../services/admin/InventoryService';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ReportDashboard = () => {
    // Range chính khi bấm Áp dụng
    const [selectedRange, setSelectedRange] = useState([
        moment().startOf('month'),
        moment().endOf('month')
    ]);

    // Ref để giữ date không gây re-render → KHÔNG BAO GIỜ NHẢY NĂM
    const tempRangeRef = useRef([
        moment().startOf('month'),
        moment().endOf('month')
    ]);

    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [start, end] = selectedRange;

        try {
            const [rev, orders, top, low, customers] = await Promise.all([
                ReportService.getRevenue('day', start, end),
                ReportService.getOrders(start, end),
                ReportService.getTopProducts(5),
                InventoryService.getLowStock(),
                ReportService.getCustomers(start, end)
            ]);

            setRevenueData((rev.breakdown || []).map(d => ({
                date: moment(d.date).format('DD/MM'),
                revenue: d.revenue || 0,
                orders: d.orders || 0
            })));

            setTopProducts(top || []);
            setLowStock(low || []);

            setStats({
                revenue: rev.totalRevenue || 0,
                totalOrders: rev.totalOrders || 0,
                completed: orders?.completed || 0,
                cancelled: orders?.cancelled || 0,
                newCustomers: customers?.newCustomers || 0,
                conversion: customers?.conversionRate || 0
            });

        } catch (error) {
            message.error('Lỗi tải dữ liệu báo cáo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /** BẤM ÁP DỤNG — cập nhật ngày chính */
    const handleApply = () => {
        if (tempRangeRef.current[0] && tempRangeRef.current[1]) {
            setSelectedRange([...tempRangeRef.current]);
        } else {
            message.warning('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc');
        }
    };

    /** Xuất Excel */
    const handleExportExcel = async () => {
        try {
            await ReportService.exportExcel('full', selectedRange[0], selectedRange[1]);
        } catch (error) {
            message.error('Xuất Excel thất bại');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>

                {/* ----------- LỊCH ĐÃ FIX HOÀN CHỈNH ------------- */}
                <Card>
                    <Space align="center">
                        <RangePicker
                            value={tempRangeRef.current}    // FIX QUAN TRỌNG NHẤT
                            format="DD/MM/YYYY"
                            allowClear={false}
                            getPopupContainer={trigger => trigger.parentNode}

                            // chỉ update ref — không re-render → không nhảy năm
                            onChange={(dates) => {
                                if (dates && dates[0] && dates[1]) {
                                    tempRangeRef.current = dates;
                                }
                            }}

                            renderExtraFooter={() => (
                                <div style={{ textAlign: 'center', padding: '8px' }}>
                                    <Button type="primary" size="small" onClick={handleApply}>
                                        Áp dụng ngay
                                    </Button>
                                </div>
                            )}
                        />

                        <Button type="primary" onClick={handleApply}>
                            Áp dụng
                        </Button>

                        <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
                            Xuất Excel
                        </Button>
                    </Space>
                </Card>

                {/* ----------- THỐNG KÊ ------------- */}
                <Row gutter={16}>
                    <Col span={6}>
                        <Card loading={loading}>
                            <Statistic title="Doanh thu" value={stats.revenue} suffix="đ" />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card loading={loading}>
                            <Statistic title="Đơn hàng" value={stats.totalOrders} />
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

                {/* ----------- BIỂU ĐỒ ------------- */}
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

                {/* ----------- BẢNG DỮ LIỆU ------------- */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Sản phẩm bán chạy" loading={loading}>
                            <Table
                                dataSource={topProducts}
                                columns={[
                                    { title: 'Sản phẩm', dataIndex: 'productName' },
                                    { title: 'SKU', dataIndex: 'sku' },
                                    { title: 'SL bán', dataIndex: 'soldQuantity' },
                                    { title: 'Doanh thu', dataIndex: 'revenue', render: v => v?.toLocaleString('vi-VN') + 'đ' },
                                ]}
                                pagination={false}
                                rowKey="productId"
                            />
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="Tồn kho thấp" loading={loading}>
                            <Table
                                dataSource={lowStock}
                                columns={[
                                    { title: 'Sản phẩm', dataIndex: 'productName' },
                                    { title: 'SKU', dataIndex: 'sku' },
                                    { title: 'Tồn kho', dataIndex: 'currentStock', render: v => (
                                            <span style={{ color: v < 5 ? 'red' : 'orange', fontWeight: 'bold' }}>
                                            {v}
                                        </span>
                                        )},
                                ]}
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
