// src/pages/user/ProductDetailPage.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Row, Col, Image, Typography, Space, Select,
  InputNumber, Button, message, Alert, Spin, Tag, Input
} from 'antd';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import WishlistService from '../../services/user/WishlistService';
import { useUserCart } from '../../contexts/UserCartContext';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const { addItem } = useUserCart();
  const { isAuthenticated } = useAuth();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProductCatalogService.getProductById(id);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariantId(data.variants[0].id);
      }
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (couponCode && selectedVariantId) {
      ProductCatalogService.previewDiscount(selectedVariantId, couponCode)
          .then(setDiscountedPrice)
          .catch(() => setDiscountedPrice(null));
    } else {
      setDiscountedPrice(null);
    }
  }, [couponCode, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.id === selectedVariantId);
  }, [product, selectedVariantId]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      message.error('Vui lòng chọn biến thể');
      return;
    }
    try {
      await addItem(null, { variantId: selectedVariant.id, quantity });
      message.success('Đã thêm vào giỏ hàng');
    } catch (err) {
      message.error('Lỗi khi thêm vào giỏ hàng');
    }
  };

  const handleFavorite = async () => {
    try {
      await WishlistService.addToWishlist(product.id);
      message.success('Đã thêm vào yêu thích');
    } catch (err) {
      message.error('Lỗi khi thêm vào yêu thích');
    }
  };

  const images = useMemo(() => product?.images || [], [product]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;
  if (!product) return <Alert message="Sản phẩm không tồn tại" type="warning" />;

  const currentPrice = discountedPrice || selectedVariant?.salePrice || selectedVariant?.price;

  return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <Row gutter={32}>
          <Col span={12}>
            <Image.PreviewGroup>
              <Image
                  src={images[0]?.url || product.defaultImage}
                  alt={product.name}
                  style={{ width: '100%', marginBottom: 16 }}
              />
              <Row gutter={8}>
                {images.slice(1).map(img => (
                    <Col span={6} key={img.id}>
                      <Image src={img.url} alt={img.altText} />
                    </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          </Col>
          <Col span={12}>
            <Card>
              <Title level={2}>{product.name}</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Search
                    placeholder="Nhập mã giảm giá"
                    onSearch={(value) => setCouponCode(value)}
                    allowClear
                    enterButton="Áp dụng"
                />
                <div>
                  {discountedPrice ? (
                      <>
                        <del>{selectedVariant.price.toLocaleString()} ₫</del>
                        <Title level={3} style={{ color: 'red' }}>{discountedPrice.toLocaleString()} ₫</Title>
                        <Tag color="red">Đã áp mã {couponCode}</Tag>
                      </>
                  ) : selectedVariant?.salePrice ? (
                      <>
                        <del>{selectedVariant.price.toLocaleString()} ₫</del>
                        <Title level={3} style={{ color: 'red' }}>{selectedVariant.salePrice.toLocaleString()} ₫</Title>
                      </>
                  ) : (
                      <Title level={3}>{selectedVariant?.price.toLocaleString()} ₫</Title>
                  )}
                  {product.averageRating > 0 && (
                      <Tag color="gold">⭐ {product.averageRating.toFixed(1)} ({product.reviewCount})</Tag>
                  )}
                </div>
                <Text>{product.description}</Text>
                <Select
                    style={{ width: '100%' }}
                    value={selectedVariantId}
                    onChange={setSelectedVariantId}
                >
                  {product.variants.map(v => (
                      <Option key={v.id} value={v.id}>
                        {v.attributes} - {v.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </Option>
                  ))}
                </Select>
                <InputNumber
                    min={1}
                    max={selectedVariant?.stockQuantity || 0}
                    value={quantity}
                    onChange={setQuantity}
                />
                <Text type="secondary">
                  (Còn {selectedVariant?.stockQuantity ?? 0})
                </Text>
                <Space size="middle">
                  <Button
                      type="primary"
                      size="large"
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                  >
                    Thêm vào giỏ
                  </Button>
                  {isAuthenticated && (
                      <Button size="large" onClick={handleFavorite}>
                        Yêu thích
                      </Button>
                  )}
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
  );
};

export default ProductDetailPage;