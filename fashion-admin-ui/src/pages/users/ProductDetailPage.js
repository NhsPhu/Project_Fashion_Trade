// src/user/pages/ProductDetailPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Image, Typography, Space, Select, InputNumber,
  Button, Tabs, message, Alert, Spin, Tag, Divider, Rate, Input
} from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import WishlistService from '../../services/user/WishlistService';
import { useUserCart } from '../../contexts/UserCartContext';
import { useUserAuth } from '../../contexts/UserAuthContext';
import InventoryService from '../../services/admin/InventoryService'; // THÊM: Để lấy tồn kho từ inventory

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const WAREHOUSE_ID = 1; // Kho Hà Nội (theo DB)

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [newReview, setNewReview] = useState({ rating: 0, content: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // THÊM: Lưu tồn kho thật từ inventory
  const [variantStock, setVariantStock] = useState({}); // { variantId: quantity }

  // Xử lý ảnh
  const IMAGE_BASE_URL = '/product_image/img/';
  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://placehold.co/400x400?text=No+Image';
    if (imageName.startsWith('http')) return imageName;
    return `${IMAGE_BASE_URL}${imageName}`;
  };

  const { addItem } = useUserCart();
  const { isAuthenticated } = useUserAuth();

  // Load sản phẩm
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
        setError(e.message || 'Không thể load sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // THÊM: Load tồn kho thật từ inventory cho tất cả variant
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) return;

    const loadInventoryStock = async () => {
      const stockMap = {};
      for (const variant of product.variants) {
        try {
          const res = await InventoryService.getStock(variant.id, WAREHOUSE_ID);
          stockMap[variant.id] = res.quantity || 0;
        } catch (err) {
          console.error('Lỗi lấy tồn kho:', err);
          stockMap[variant.id] = 0;
        }
      }
      setVariantStock(stockMap);
    };
    loadInventoryStock();
  }, [product]);

  // Kiểm tra wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product?.id) {
        setIsInWishlist(false);
        return;
      }
      try {
        const wishlist = await WishlistService.getWishlist();
        if (Array.isArray(wishlist)) {
          const exists = wishlist.some(item => item.id === product.id);
          setIsInWishlist(exists);
        }
      } catch (err) {
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          console.error('Lỗi kiểm tra wishlist:', err);
        }
      }
    };
    checkWishlistStatus();
  }, [product, isAuthenticated]);

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.id === selectedVariantId) || null;
  }, [product, selectedVariantId]);

  // Tính giá sale và % giảm - ĐÃ SỬA ĐÚNG
  const price = selectedVariant?.price || 0;
  const salePrice = selectedVariant?.salePrice;
  const hasDiscount = salePrice && salePrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      message.warning('Vui lòng chọn biến thể');
      return;
    }
    setAddingToCart(true);
    try {
      await addItem({
        variantId: selectedVariantId,
        quantity: quantity || 1
      });
      message.success('Đã thêm vào giỏ hàng');
    } catch (e) {
      message.error(e.message || 'Lỗi thêm giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      message.info('Vui lòng đăng nhập để lưu sản phẩm yêu thích');
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(product.id);
        setIsInWishlist(false);
        message.success('Đã bỏ yêu thích');
      } else {
        await WishlistService.addToWishlist(product.id);
        setIsInWishlist(true);
        message.success('Đã thêm vào yêu thích');
      }
    } catch (e) {
      message.error('Thao tác thất bại');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.rating || !newReview.content.trim()) {
      message.warning('Vui lòng nhập đủ thông tin');
      return;
    }
    setSubmittingReview(true);
    try {
      const savedReview = await ProductCatalogService.addReview(product.id, {
        rating: newReview.rating,
        body: newReview.content.trim(),
      });
      message.success('Đánh giá thành công!');
      setProduct(prev => ({
        ...prev,
        reviews: [savedReview, ...(prev.reviews || [])],
        reviewCount: (prev.reviewCount || 0) + 1,
      }));
      setNewReview({ rating: 0, content: '' });
    } catch (err) {
      message.error('Gửi đánh giá thất bại');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />;
  if (!product) return <Alert message="Không tìm thấy sản phẩm" type="info" showIcon style={{ margin: 24 }} />;

  return (
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={24}>
          {/* Ảnh sản phẩm */}
          <Col xs={24} md={12}>
            <Image
                width="100%"
                src={getImageUrl(product.defaultImage)}
                alt={product.name}
                fallback="https://placehold.co/500x500?text=No+Image"
                style={{ borderRadius: 12 }}
            />
            <Space style={{ marginTop: 16, overflowX: 'auto', width: '100%' }} wrap={false}>
              {(product.images || []).map(img => (
                  <div key={img.id} style={{ border: '2px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                    <Image
                        width={80}
                        height={80}
                        src={getImageUrl(img.url)}
                        preview={true}
                        style={{ objectFit: 'cover' }}
                    />
                  </div>
              ))}
            </Space>
          </Col>
          {/* Thông tin */}
          <Col xs={24} md={12}>
            <Title level={2} style={{ marginBottom: 12 }}>{product.name}</Title>
            <Space size={8} style={{ marginBottom: 16 }}>
              {product.categoryName && <Tag color="blue">{product.categoryName}</Tag>}
              {product.brandName && <Tag color="green">{product.brandName}</Tag>}
            </Space>
            <Divider style={{ margin: '16px 0' }} />
            {/* SKU & Tồn kho - SỬA: DÙNG TỒN KHO THẬT TỪ INVENTORY */}
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <div>
                <Text strong>SKU: </Text>
                <Text type="secondary">{selectedVariant?.sku || 'N/A'}</Text>
              </div>
              <div>
                <Text strong>Tồn kho: </Text>
                <Tag color={variantStock[selectedVariantId] > 0 ? 'green' : 'red'}>
                  {variantStock[selectedVariantId] > 0 ? `${variantStock[selectedVariantId]} sản phẩm` : 'Hết hàng'}
                </Tag>
              </div>
            </Space>
            {/* GIÁ SALE SIÊU ĐẸP */}
            <div style={{ margin: '30px 0 20px 0' }}>
              <Text strong style={{ fontSize: 18 }}>Giá:</Text>
              <div style={{ marginTop: 12 }}>
                {hasDiscount ? (
                    <Space align="baseline" size={16}>
                      <Text delete type="secondary" style={{ fontSize: 20 }}>
                        {price.toLocaleString('vi-VN')} ₫
                      </Text>
                      <Text strong style={{ fontSize: 38, color: '#ff4d4f', fontWeight: 'bold' }}>
                        {salePrice.toLocaleString('vi-VN')} ₫
                      </Text>
                      <Tag color="red" style={{ fontSize: 18, padding: '6px 16px', fontWeight: 'bold', borderRadius: 20 }}>
                        -{discountPercent}%
                      </Tag>
                    </Space>
                ) : (
                    <Text strong style={{ fontSize: 38, color: '#d4380d', fontWeight: 'bold' }}>
                      {price.toLocaleString('vi-VN')} ₫
                    </Text>
                )}
              </div>
            </div>
            {/* Biến thể */}
            <div style={{ marginBottom: 20 }}>
              <Text strong>Biến thể:</Text>
              <Select
                  style={{ width: '100%', marginTop: 8 }}
                  value={selectedVariantId}
                  onChange={(val) => { setSelectedVariantId(val); setQuantity(1); }}
              >
                {(product.variants || []).map(v => (
                    <Option key={v.id} value={v.id}>
                      {v.sku} - {v.attributes || 'Mặc định'} (Còn {variantStock[v.id] ?? 0})
                    </Option>
                ))}
              </Select>
            </div>
            {/* Số lượng */}
            <div style={{ marginBottom: 30 }}>
              <Text strong>Số lượng:</Text>
              <InputNumber
                  min={1}
                  max={variantStock[selectedVariantId] ?? 99} // SỬA: Dùng tồn kho thật từ inventory
                  value={quantity}
                  onChange={setQuantity}
                  style={{ marginLeft: 12, width: 120 }}
              />
            </div>
            {/* Nút hành động */}
            <Space size={16}>
              <Button
                  type="primary"
                  size="large"
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  style={{ minWidth: 200, height: 50, fontSize: 16 }}
              >
                Thêm vào giỏ hàng
              </Button>
              {/* CHỈ HIỆN NÚT YÊU THÍCH KHI ĐÃ ĐĂNG NHẬP */}
              {isAuthenticated && (
                  <Button
                      size="large"
                      danger={isInWishlist}
                      type={isInWishlist ? 'primary' : 'default'}
                      icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                      onClick={handleFavorite}
                      loading={wishlistLoading}
                      style={{ height: 50 }}
                  >
                    {isInWishlist ? 'Đã thích' : 'Yêu thích'}
                  </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Tab đánh giá */}
        <Card style={{ marginTop: 40 }}>
          <Tabs items={[
            {
              key: 'reviews',
              label: `Đánh giá (${product.reviewCount || 0})`,
              children: (
                  <div>
                    {isAuthenticated ? (
                        <Card title="Viết đánh giá" size="small" style={{ marginBottom: 20 }}>
                          <Rate
                              value={newReview.rating}
                              onChange={(v) => setNewReview({ ...newReview, rating: v })}
                          />
                          <TextArea
                              rows={4}
                              placeholder="Chia sẻ trải nghiệm của bạn..."
                              value={newReview.content}
                              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                              style={{ margin: '12px 0' }}
                          />
                          <Button
                              type="primary"
                              onClick={handleSubmitReview}
                              loading={submittingReview}
                          >
                            Gửi đánh giá
                          </Button>
                        </Card>
                    ) : (
                        <Alert message="Đăng nhập để viết đánh giá" type="info" showIcon />
                    )}

                    {(product.reviews || []).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
                          Chưa có đánh giá nào. Hãy là người đầu tiên!
                        </div>
                    ) : (
                        product.reviews.map(r => (
                            <Card key={r.id} size="small" style={{ marginTop: 12 }}>
                              <Space>
                                <Text strong>{r.userName || 'Khách'}</Text>
                                <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
                              </Space>
                              <Paragraph style={{ margin: '8px 0 0' }}>{r.body}</Paragraph>
                            </Card>
                        ))
                    )}
                  </div>
              )
            }
          ]} />
        </Card>
      </div>
  );
};

export default ProductDetailPage;