import React, { useState } from 'react';
import { Table, Button, Image, InputNumber, Space, Typography, message } from 'antd';
import { useUserCart } from '../../contexts/UserCartContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CartPage = () => {
    const { cart, updateItem, removeItem, clearCart } = useUserCart();
    const navigate = useNavigate();

    const handleGoToCheckout = () => {
        if (!cart || cart.items.length === 0) {
            message.warning('Giỏ hàng trống.');
            return;
        }
        // Chuyển hướng đến trang checkout mới
        navigate('/checkout');
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Image src={record.productImage} width={60} />
                    <div>
                        <div>{record.productName}</div>
                        <div style={{ color: '#999' }}>SKU: {record.variantSku}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'currentPrice',
            render: (v) => `${(v || 0).toLocaleString()} ₫`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            render: (q, record) => (
                <InputNumber min={1} value={q} onChange={(val) => updateItem(record.id, val)} />
            ),
        },
        {
            title: 'Tạm tính',
            dataIndex: 'subtotal',
            render: (v) => `${(v || 0).toLocaleString()} ₫`,
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Button danger onClick={() => removeItem(record.id)}>Xóa</Button>
            ),
        },
    ];

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, textAlign: 'center' }}>
                <Title level={2}>Giỏ hàng</Title>
                <div style={{ padding: 48 }}>
                    <p style={{ fontSize: 18, color: '#999' }}>Giỏ hàng của bạn đang trống</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <Title level={2}>Giỏ hàng</Title>

            <Table
                dataSource={cart.items.map(i => ({ ...i, key: i.id }))}
                columns={columns}
                pagination={false}
                bordered
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <Button onClick={() => clearCart()} danger>Xóa toàn bộ</Button>

                <Space align="center" size="large">
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Tổng cộng: {(cart.totalAmount || 0).toLocaleString()} ₫
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        onClick={handleGoToCheckout}
                    >
                        Tiến hành thanh toán
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default CartPage;
