// src/user/pages/CartPage.js
import React, { useState } from 'react';
import { Table, Button, Image, InputNumber, Space, Typography, message, Card, Input, Row, Col, Divider, Tag } from 'antd';
import { useUserCart } from '../contexts/UserCartContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

// ĐƯỜNG DẪN ẢNH CHUẨN – GIỐNG HỆT ProductDetailPage & ProductListPage
const IMAGE_BASE_URL = '/product_image/img/';

const CartPage = () => {
    const { cart, updateQuantity, removeItem, clearCart } = useUserCart();
    const navigate = useNavigate();
    const [discountCode, setDiscountCode] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);

    // Hàm xử lý ảnh – giống hệt 2 trang kia
    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://via.placeholder.com/80?text=No+Image';
        if (imageName.startsWith('http')) return imageName;
        return `${IMAGE_BASE_URL}${imageName}`;
    };

    const handleCheckout = () => {
        if (!cart?.items || cart.items.size === 0) {
            message.warning('Giỏ hàng trống!');
            return;
        }
        navigate('/checkout');
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (!newQuantity || newQuantity < 1) return;
        try {
            await updateQuantity(itemId, newQuantity);
        } catch (error) {
            message.error(error.message || 'Cập nhật thất bại');
        }
    };

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            message.warning('Vui lòng nhập mã giảm giá');
            return;
        }
        setApplyingDiscount(true);
        try {
            message.info('Chức năng mã giảm giá đang phát triển');
        } finally {
            setApplyingDiscount(false);
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Space>
                    <Image
                        src={getImageUrl(record.productImage)}   // ← ĐÚNG TRƯỜNG TỪ BACKEND
                        width={80}
                        height={80}
                        alt={record.productName}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                        preview={false}
                        fallback="https://via.placeholder.com/80?text=Error"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Img';
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.productName}</div>
                        <div style={{ color: '#999', fontSize: 12 }}>
                            SKU: {record.variantSku || 'N/A'}
                        </div>
                        {record.stockQuantity !== null && record.stockQuantity <= 5 && (
                            <Tag color="red" style={{ marginTop: 4 }}>
                                Chỉ còn {record.stockQuantity} sản phẩm
                            </Tag>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'currentPrice',
            render: (price) => price ? `${price.toLocaleString()} ₫` : '—',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: (q, record) => (
                <InputNumber
                    min={1}
                    max={record.stockQuantity || 999}
                    value={q}
                    onChange={(val) => handleUpdateQuantity(record.id, val)}
                    style={{ width: 80 }}
                />
            ),
        },
        {
            title: 'Tạm tính',
            dataIndex: 'subtotal',
            render: (sub) => sub ? <strong style={{ color: '#d4380d' }}>{sub.toLocaleString()} ₫</strong> : '—',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button danger size="small" onClick={() => removeItem(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    // Giỏ hàng trống
    if (!cart || cart.items?.size === 0) {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40, textAlign: 'center' }}>
                <Title level={2}>Giỏ hàng</Title>
                <div style={{ padding: 60 }}>
                    <p style={{ fontSize: 18, color: '#999' }}>Giỏ hàng của bạn đang trống</p>
                    <Button type="primary" size="large" onClick={() => navigate('/products')}>
                        Tiếp tục mua sắm
                    </Button>
                </div>
            </div>
        );
    }

    // Chuẩn hóa dữ liệu (giữ nguyên logic cũ của bạn)
    const dataSource = Array.from(cart.items || []).map(item => ({
        ...item,
        key: item.id,
    }));

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <Title level={2}>Giỏ hàng ({cart.totalItems || 0} sản phẩm)</Title>

            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                bordered
                style={{ marginBottom: 24 }}
            />

            <Row gutter={24}>
                <Col xs={24} md={12}>
                    <Card title="Mã giảm giá" size="small">
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Nhập mã giảm giá"
                                value={discountCode}
                                onChange={e => setDiscountCode(e.target.value)}
                            />
                            <Button type="primary" loading={applyingDiscount} onClick={handleApplyDiscount}>
                                Áp dụng
                            </Button>
                        </Space.Compact>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card size="small">
                        <div style={{ fontSize: 16, lineHeight: 2 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tạm tính:</span>
                                <span>{(cart.totalAmount || 0).toLocaleString()} ₫</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Giảm giá:</span>
                                <span style={{ color: '#d4380d' }}>0 ₫</span>
                            </div>
                            <Divider style={{ margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 'bold' }}>
                                <span>Tổng cộng:</span>
                                <span style={{ color: '#d4380d' }}>{(cart.totalAmount || 0).toLocaleString()} ₫</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button danger size="large" onClick={clearCart}>
                    Xóa toàn bộ giỏ hàng
                </Button>
                <Button type="primary" size="large" onClick={handleCheckout}>
                    Thanh toán
                </Button>
            </div>
        </div>
    );
};

export default CartPage;