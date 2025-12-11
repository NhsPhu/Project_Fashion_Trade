// src/user/pages/WishlistPage.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Space, message, Spin } from 'antd';
import WishlistService from '../../services/user/WishlistService';
import { useUserCart } from '../../contexts/UserCartContext';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useUserCart();

  const load = async () => {
    setLoading(true);
    try {
      const data = await WishlistService.getWishlist();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi load wishlist:', error);
      setItems([]);
      message.error('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addToCart = async (product) => {
    try {
      const firstVariant = (product.variants || [])[0];
      if (!firstVariant) {
        message.warning('Sản phẩm chưa có biến thể');
        return;
      }
      await addItem({ variantId: firstVariant.id, quantity: 1 });
      message.success('Đã thêm vào giỏ hàng');
    } catch (e) {
      message.error('Không thể thêm vào giỏ');
    }
  };

  const remove = async (id) => {
    try {
      await WishlistService.removeFromWishlist(id);
      await load();
      message.success('Đã xóa khỏi yêu thích');
    } catch (e) {
      message.error('Không thể xóa');
    }
  };

  if (loading) {
    return (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
    );
  }

  return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2 style={{ fontSize: 24, marginBottom: 24 }}>Sản phẩm yêu thích</h2>

        {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <p style={{ fontSize: 18, color: '#999' }}>Chưa có sản phẩm yêu thích</p>
            </div>
        ) : (
            <Row gutter={[16, 16]}>
              {items.map(product => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                    <Card
                        hoverable
                        cover={
                          <img
                              src={product.defaultImage || 'https://via.placeholder.com/220'}
                              alt={product.name}
                              style={{ height: 220, objectFit: 'cover' }}
                          />
                        }
                    >
                      <Card.Meta title={product.name} />
                      <Space style={{ marginTop: 12, width: '100%' }} direction="vertical">
                        <Button type="primary" block onClick={() => addToCart(product)}>
                          Thêm vào giỏ
                        </Button>
                        <Button danger block onClick={() => remove(product.id)}>
                          Bỏ yêu thích
                        </Button>
                      </Space>
                    </Card>
                  </Col>
              ))}
            </Row>
        )}
      </div>
  );
};

export default WishlistPage;