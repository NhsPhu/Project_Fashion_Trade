import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, Spin } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarCircleOutlined } from '@ant-design/icons';
// ========== SỬA LỖI Ở DÒNG NÀY ==========
import DashboardService from '../services/DashboardService'; // Xóa 1 dấu chấm, chỉ còn ../
// ===================================

const { Title, Paragraph } = Typography;

function DashboardPage() {
    // State để lưu dữ liệu, loading, error
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect để gọi API khi trang được tải
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await DashboardService.getStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // Mảng rỗng [] = chỉ chạy 1 lần

    // Xử lý trạng thái Loading
    if (loading) {
        return <Spin tip="Đang tải số liệu..." size="large" fullscreen />;
    }

    // Xử lý trạng thái Lỗi
    if (error) {
        return <p style={{ color: 'red' }}>Lỗi: {error}</p>;
    }

    // Render khi có dữ liệu
    return (
        <div>
            <Title level={2}>Chào mừng bạn đến với Dashboard</Title>
            <Paragraph>Đây là trang quản trị, dưới đây là các số liệu thống kê thực tế:</Paragraph>

            <Row gutter={16} style={{marginTop: '24px'}}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Đơn hàng"
                            value={stats ? stats.totalOrders : 0} // Dữ liệu thực tế
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh thu (Đã giao)"
                            value={stats ? stats.totalRevenue : 0} // Dữ liệu thực tế
                            prefix={<DollarCircleOutlined />}
                            suffix="VND"
                            precision={0} // Không hiển thị số lẻ
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Khách hàng"
                            value={stats ? stats.totalCustomers : 0} // Dữ liệu thực tế
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardPage;