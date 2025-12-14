import React, { useState, useEffect } from 'react';
import {
    Typography, Card, Row, Col, Statistic, Spin, Table,
    List, Tag, Alert, Progress, Space, Avatar
} from 'antd';
import {
    ShoppingCartOutlined, UserOutlined, DollarCircleOutlined,
    RiseOutlined, WarningOutlined, FileTextOutlined
} from '@ant-design/icons';

// Import Service đã cập nhật
import DashboardService from '../../services/admin/DashboardService';

const { Title, Text } = Typography;

function DashboardPage() {
    // State lưu trữ dữ liệu tổng hợp
    const [data, setData] = useState({
        stats: null,           // Tổng quan
        revenue: [],           // Doanh thu
        recentOrders: [],      // Đơn mới
        topProducts: [],       // Top bán chạy
        lowStock: [],          // Sắp hết hàng
        orderStatus: {}        // Tỷ lệ đơn hàng
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Gọi song song tất cả API để tiết kiệm thời gian
                // Lưu ý: Nếu Backend chưa có API nào thì phần đó sẽ trả về null/lỗi nhẹ
                const [
                    statsRes,
                    revenueRes,
                    ordersRes,
                    productsRes,
                    stockRes,
                    statusRes
                ] = await Promise.allSettled([
                    DashboardService.getStats(),
                    DashboardService.getRevenueChart('month'),
                    DashboardService.getRecentOrders(5),
                    DashboardService.getTopSellingProducts(5),
                    DashboardService.getLowStockAlerts(10),
                    DashboardService.getOrderStatusStats()
                ]);

                // Cập nhật state (Chỉ lấy value nếu status là 'fulfilled')
                setData({
                    stats: statsRes.status === 'fulfilled' ? statsRes.value : null,
                    revenue: revenueRes.status === 'fulfilled' ? revenueRes.value : [],
                    recentOrders: ordersRes.status === 'fulfilled' ? ordersRes.value : [],
                    topProducts: productsRes.status === 'fulfilled' ? productsRes.value : [],
                    lowStock: stockRes.status === 'fulfilled' ? stockRes.value : [],
                    orderStatus: statusRes.status === 'fulfilled' ? statusRes.value : {}
                });

            } catch (err) {
                console.error("Dashboard Load Error:", err);
                setError("Một số dữ liệu không thể tải. Vui lòng kiểm tra console.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return <Spin tip="Đang tải dữ liệu Dashboard..." size="large" fullscreen />;

    // Cột cho bảng Đơn hàng mới nhất
    const orderColumns = [
        { title: 'Mã ĐH', dataIndex: 'id', key: 'id', render: text => <Text strong>#{text}</Text> },
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', render: val => val?.toLocaleString() + ' đ' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = 'default';
                if (status === 'COMPLETED') color = 'green';
                if (status === 'PENDING') color = 'orange';
                if (status === 'CANCELLED') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: val => new Date(val).toLocaleDateString('vi-VN') }
    ];

    // Cột cho bảng Doanh thu
    const revenueColumns = [
        { title: 'Thời gian', dataIndex: 'date', key: 'date' },
        { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: val => <Text type="success">{val?.toLocaleString()} đ</Text> }
    ];

    return (
        <div style={{ paddingBottom: 40 }}>
            <Title level={2}>Tổng quan hệ thống</Title>
            {error && <Alert message={error} type="warning" showIcon style={{ marginBottom: 24 }} />}

            {/* 1. THỐNG KÊ TỔNG QUAN (CARDS) */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ background: '#e6f7ff' }}>
                        <Statistic
                            title="Tổng Đơn hàng"
                            value={data.stats?.totalOrders || 0}
                            prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ background: '#f6ffed' }}>
                        <Statistic
                            title="Tổng Doanh thu"
                            value={data.stats?.totalRevenue || 0}
                            prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />}
                            suffix="₫"
                            precision={0}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} style={{ background: '#fff7e6' }}>
                        <Statistic
                            title="Tổng Khách hàng"
                            value={data.stats?.totalCustomers || 0}
                            prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 2. CẢNH BÁO TỒN KHO & TRẠNG THÁI ĐƠN */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card title={<><WarningOutlined style={{ color: 'red' }} /> Cảnh báo sắp hết hàng</>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={data.lowStock}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image} shape="square" />}
                                        title={item.productName}
                                        description={`SKU: ${item.sku}`}
                                    />
                                    <Tag color="red">Còn: {item.quantity}</Tag>
                                </List.Item>
                            )}
                            locale={{ emptyText: 'Kho hàng ổn định' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Tỷ lệ đơn hàng">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text>Hoàn thành</Text>
                                <Progress percent={data.orderStatus?.completedPercent || 0} status="success" />
                            </div>
                            <div>
                                <Text>Đang xử lý</Text>
                                <Progress percent={data.orderStatus?.pendingPercent || 0} status="active" />
                            </div>
                            <div>
                                <Text>Đã hủy</Text>
                                <Progress percent={data.orderStatus?.cancelledPercent || 0} status="exception" />
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* 3. BẢNG ĐƠN HÀNG & TOP SẢN PHẨM */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Đơn hàng mới nhất" extra={<a href="/admin/orders">Xem tất cả</a>}>
                        <Table
                            columns={orderColumns}
                            dataSource={data.recentOrders}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title={<><RiseOutlined style={{ color: 'blue' }} /> Top sản phẩm bán chạy</>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={data.topProducts}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{index + 1}</Avatar>}
                                        title={item.name}
                                        description={<Text type="secondary">Đã bán: {item.soldCount}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 4. DOANH THU (DẠNG BẢNG) */}
            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="Chi tiết Doanh thu (Tháng này)">
                        <Table
                            columns={revenueColumns}
                            dataSource={data.revenue}
                            rowKey="date"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardPage;