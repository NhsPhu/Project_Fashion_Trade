import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Image, Typography, Space, Select, InputNumber, Button, Tabs, message, Alert, Spin } from 'antd';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import WishlistService from '../../services/user/WishlistService';
import { useUserCart } from '../../contexts/UserCartContext';
import { useUserAuth } from '../../contexts/UserAuthContext';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useUserCart();
  const { isAuthenticated } = useUserAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductCatalogService.getProductById(id);
        setProduct(data);
        if (data?.variants?.length > 0) {
          setSelectedVariantId(data.variants[0].id);
        }
      } catch (e) {
        console.error('Lỗi load sản phẩm:', e);
        setError(e.message || 'Không thể load sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.id === selectedVariantId) || null;
  }, [product, selectedVariantId]);

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      message.warning('Vui lòng chọn biến thể');
      return;
    }
    try {
      await addItem({ variantId: selectedVariantId, quantity });
      message.success('Đã thêm vào giỏ hàng');
    } catch (e) {
      message.error(e.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      message.error('Vui lòng đăng nhập để thêm yêu thích');
      return;
    }
    try {
      await WishlistService.addToWishlist(product.id);
      message.success('Đã thêm vào yêu thích');
    } catch (e) {
      message.error(e.message || 'Không thể thêm vào yêu thích');
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />;

  if (!product) return <Alert message="Sản phẩm không tồn tại" type="info" showIcon style={{ margin: 24 }} />;

  return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Image
                width="100%"
                src={product.defaultImage || 'https://via.placeholder.com/400?text=No+Image'}
                alt={product.name}
                fallback="https://via.placeholder.com/400?text=No+Image"
            />
            <Space style={{ marginTop: 12 }}>
              {(product.images || []).map(img => (
                  <Image
                      key={img.id}
                      width={100}
                      src={img.url}
                      alt={img.altText}
                      fallback="https://via.placeholder.com/100?text=No+Image"
                  />
              ))}
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Title level={2}>{product.name}</Title>
            <Paragraph>{product.description || 'Chưa có mô tả'}</Paragraph>
            <Space direction="vertical" size="large">
              <div>
                <span>Giá: </span>
                <span style={{ fontWeight: 'bold' }}>
                {selectedVariant?.salePrice ? selectedVariant.salePrice.toLocaleString('vi-VN') : selectedVariant?.price.toLocaleString('vi-VN')} ₫
              </span>
              </div>
              <div>
                <span>Biến thể:</span>
                <Select
                    style={{ width: 260, marginLeft: 12 }}
                    value={selectedVariantId}
                    onChange={setSelectedVariantId}
                >
                  {(product.variants || []).map(v => (
                      <Option key={v.id} value={v.id}>
                        {v.sku} {v.attributes}
                      </Option>
                  ))}
                </Select>
              </div>
              <div>
                <span>Số lượng:</span>
                <InputNumber min={1} max={selectedVariant?.stockQuantity || 99} value={quantity} onChange={setQuantity} style={{ marginLeft: 12 }} />
              </div>
              <Space>
                <Button type="primary" onClick={handleAddToCart}>Thêm vào giỏ</Button>
                {isAuthenticated && <Button onClick={handleFavorite}>Yêu thích</Button>}
              </Space>
            </Space>
          </Col>
        </Row>

        <Card style={{ marginTop: 24 }}>
          <Tabs
              items={[
                {
                  key: 'desc',
                  label: 'Mô tả',
                  children: <Paragraph>{product.description || 'Chưa có mô tả'}</Paragraph>,
                },
                {
                  key: 'reviews',
                  label: `Đánh giá (${product.reviewCount || 0})`,
                  children: (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {(product.reviews || []).map(r => (
                            <Card key={r.id} size="small" title={`${r.userName} - ${r.rating}`}>
                              <Paragraph style={{ marginBottom: 0 }}>{r.body}</Paragraph>
                            </Card>
                        ))}
                        {(!product.reviews || product.reviews.length === 0) && <div>Chưa có đánh giá</div>}
                      </Space>
                  ),
                },
              ]}
          />
        </Card>
      </div>
  );
};

export default ProductDetailPage;