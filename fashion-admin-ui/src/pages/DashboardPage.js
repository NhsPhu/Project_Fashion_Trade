// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Typography, Button, Spin } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InventoryService from '../services/InventoryService';

const { Title } = Typography;

function DashboardPage() {
    const navigate = useNavigate();
    const [lowStockCount, setLowStockCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                const data = await InventoryService.getLowStock();
                setLowStockCount(data.length);
            } catch (error) {
                console.error('Lỗi lấy tồn kho thấp:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLowStock();
    }, []);

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
                                    value={lowStockCount}
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
        </div>
    );
}

export default DashboardPage;