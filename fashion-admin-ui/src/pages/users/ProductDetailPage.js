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

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

  // --- 1. SỬA LỖI ẢNH: Dùng server placeholder ổn định hơn ---
  const IMAGE_BASE_URL = '/product_image/img/';
  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://placehold.co/400x400?text=No+Image'; // Dùng placehold.co
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

  // --- 2. SỬA LỖI 403: Chỉ check Wishlist khi ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    const checkWishlistStatus = async () => {
      // Nếu chưa đăng nhập hoặc chưa có sản phẩm -> Dừng ngay
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
        // Bỏ qua lỗi 401/403 để không spam console
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          console.error('Lỗi kiểm tra wishlist:', err);
        }
      }
    };
    checkWishlistStatus();
  }, [product, isAuthenticated]); // Chạy lại khi trạng thái đăng nhập thay đổi

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(v => v.id === selectedVariantId) || null;
  }, [product, selectedVariantId]);

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      message.warning('Vui lòng chọn biến thể');
      return;
    }
    if (addingToCart) return;
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
      navigate('/login'); // Chuyển hướng nếu chưa đăng nhập
      return;
    }
    if (wishlistLoading) return;
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
      if (e.message === 'ALREADY_IN_WISHLIST') {
        setIsInWishlist(true);
        message.info('Sản phẩm đã có trong danh sách');
      } else {
        message.error('Thao tác thất bại');
      }
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
          <Col xs={24} md={12}>
            <Image
                width="100%"
                src={getImageUrl(product.defaultImage)}
                alt={product.name}
                fallback="https://placehold.co/400x400?text=Image+Error"
            />
            <Space style={{ marginTop: 12, overflowX: 'auto', width: '100%' }}>
              {(product.images || []).map(img => (
                  <div key={img.id} style={{ border: '1px solid #ddd', padding: 2, cursor: 'pointer' }}>
                    <Image
                        width={80} height={80}
                        style={{ objectFit: 'cover' }}
                        src={getImageUrl(img.url)}
                        preview={true}
                    />
                  </div>
              ))}
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Title level={2}>{product.name}</Title>
            {product.categoryName && <Tag color="blue">{product.categoryName}</Tag>}
            {product.brandName && <Tag color="green">{product.brandName}</Tag>}
            <Divider />
            <Paragraph>{product.description}</Paragraph>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Giá: </Text>
                <Text strong style={{ fontSize: 22, color: '#d4380d' }}>
                  {selectedVariant?.price?.toLocaleString('vi-VN') || 0} ₫
                </Text>
              </div>

              <div>
                <Text strong>Biến thể:</Text>
                <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={selectedVariantId}
                    onChange={(val) => { setSelectedVariantId(val); setQuantity(1); }}
                >
                  {(product.variants || []).map(v => (
                      <Option key={v.id} value={v.id}>
                        {v.sku} - {v.attributes} (Còn {v.stockQuantity})
                      </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text strong>Số lượng:</Text>
                <InputNumber min={1} max={selectedVariant?.stockQuantity || 10} value={quantity} onChange={setQuantity} style={{ marginLeft: 12 }} />
              </div>

              <Space>
                <Button type="primary" size="large" onClick={handleAddToCart} loading={addingToCart}>
                  Thêm vào giỏ
                </Button>
                <Button
                    size="large"
                    danger={isInWishlist}
                    type={isInWishlist ? 'primary' : 'default'}
                    icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleFavorite}
                    loading={wishlistLoading}
                >
                  {isInWishlist ? 'Đã thích' : 'Yêu thích'}
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Phần Tabs đánh giá giữ nguyên như cũ, chỉ render lại JSX */}
        <Card style={{ marginTop: 24 }}>
          <Tabs items={[
            { key: 'reviews', label: `Đánh giá (${product.reviewCount || 0})`, children: (
                  <div>
                    {/* Render phần đánh giá tương tự file cũ */}
                    {isAuthenticated ? (
                        <Card title="Viết đánh giá" size="small" style={{marginBottom: 16}}>
                          <Rate value={newReview.rating} onChange={(v) => setNewReview({...newReview, rating: v})} />
                          <TextArea rows={3} style={{marginTop: 8}} value={newReview.content} onChange={(e)=>setNewReview({...newReview, content: e.target.value})} />
                          <Button type="primary" style={{marginTop: 8}} onClick={handleSubmitReview} loading={submittingReview}>Gửi</Button>
                        </Card>
                    ) : <Alert message="Đăng nhập để đánh giá" type="info" />}

                    {(product.reviews || []).map(r => (
                        <Card key={r.id} size="small" style={{marginTop: 8}}>
                          <Text strong>{r.userName}</Text> <Rate disabled value={r.rating} style={{fontSize: 12}} />
                          <p>{r.body}</p>
                        </Card>
                    ))}
                  </div>
              )}
          ]} />
        </Card>
      </div>
  );
};

export default ProductDetailPage;