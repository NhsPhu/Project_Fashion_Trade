import React from 'react';
import { Table, Button, Image, InputNumber, Space, Typography } from 'antd';
import { useUserCart } from '../../contexts/UserCartContext';

const { Title } = Typography;

const CartPage = () => {
  const { cart, updateItem, removeItem, clearCart } = useUserCart();

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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Button onClick={() => clearCart()} danger>Xóa toàn bộ</Button>
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>
          Tổng: {(cart.totalAmount || 0).toLocaleString()} ₫
        </div>
      </div>
    </div>
  );
};

export default CartPage;
