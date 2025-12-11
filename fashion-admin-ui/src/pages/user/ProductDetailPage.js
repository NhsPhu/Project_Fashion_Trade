// src/pages/user/ProductDetailPage.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Row, Col, Image, Typography, Space, Select,
  InputNumber, Button, message, Alert, Spin, Tag
} from 'antd';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import WishlistService from '../../services/user/WishlistService';
import { useUserCart } from '../../contexts/UserCartContext';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const ProductDetailPage = () => {
  const { id } = useParams(); // XÓA TYPE
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useUserCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
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
        const status = e.response?.status;
        if (status === 404) setError('Sản phẩm không tồn tại.');
        else if (status === 403) setError('Truy cập bị từ chối.');
        else setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.id === selectedVariantId) ?? null;
  }, [product, selectedVariantId]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant || selectedVariant.stockQuantity < quantity) {
      message.warning('Sản phẩm không đủ số lượng');
      return;
    }
    try {
      await addItem({ variantId: selectedVariantId, quantity });
      message.success('Đã thêm vào giỏ hàng!');
    } catch (e) {
      message.error('Không thể thêm vào giỏ');
    }
  }, [selectedVariant, selectedVariantId, quantity, addItem]);

  const handleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập');
      return;
    }
    if (!product?.id) return;
    try {
      await WishlistService.addToWishlist(product.id);
      message.success('Đã thêm vào yêu thích');
    } catch (e) {
      message.error('Lỗi yêu thích');
    }
  }, [isAuthenticated, product?.id]);

  if (loading) {
    return (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />;
  }

  if (!product) {
    return <Alert message="Không tìm thấy sản phẩm" type="info" showIcon style={{ margin: 24 }} />;
  }

  return (
      <div style={{ padding: 24, background: '#f9f9f9' }}>
        <Row gutter={32}>
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <Image
                  width="100%"
                  src={selectedVariant?.images?.[0]?.url || product.defaultImage}
                  fallback="https://via.placeholder.com/500?text=No+Image"
                  style={{ borderRadius: 8, objectFit: 'cover' }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <Title level={2}>{product.name}</Title>
              <Space size="small">
                <Tag color="blue">{product.brand?.name || 'N/A'}</Tag>
                <Tag color="green">{product.category?.name || 'N/A'}</Tag>
              </Space>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#d4380d', margin: '16px 0' }}>
                {(selectedVariant?.salePrice ?? selectedVariant?.price ?? 0).toLocaleString('vi-VN')} ₫
              </div>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Biến thể:</Text>
                  <Select
                      style={{ width: '100%', marginTop: 8 }}
                      value={selectedVariantId}
                      onChange={setSelectedVariantId}
                      placeholder="Chọn kích thước/màu sắc"
                  >
                    {product.variants.map(v => (
                        <Option key={v.id} value={v.id} disabled={v.stockQuantity === 0}>
                          <Space>
                            {v.sku}
                            <Text type="secondary">{v.attributes}</Text>
                            {v.stockQuantity === 0 && <Tag color="red">Hết hàng</Tag>}
                          </Space>
                        </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Text strong>Số lượng:</Text>
                  <InputNumber
                      min={1}
                      max={selectedVariant?.stockQuantity ?? 1}
                      value={quantity}
                      onChange={(value) => setQuantity(value ?? 1)}
                      style={{ marginLeft: 12, width: 120 }}
                      addonAfter="cái"
                  />
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    (Còn {selectedVariant?.stockQuantity ?? 0})
                  </Text>
                </div>
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