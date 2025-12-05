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
import { useUserCart } from '../../user/contexts/UserCartContext';
import { useUserAuth } from '../../user/contexts/UserAuthContext';

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

  // State cho phần đánh giá mới
  const [newReview, setNewReview] = useState({ rating: 0, content: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // --- QUAN TRỌNG: Cấu hình đường dẫn ảnh ---
  const IMAGE_BASE_URL = '/product_image/img/';

  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://via.placeholder.com/400?text=No+Image'; // Ảnh mặc định nếu null
    if (imageName.startsWith('http')) return imageName; // Nếu DB lưu link online
    return `${IMAGE_BASE_URL}${imageName}`; // Ghép đường dẫn public
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
        setError(e.message || 'Không thể load sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Kiểm tra wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product?.id) return;
      try {
        const wishlist = await WishlistService.getWishlist();
        const exists = wishlist.some(item => item.id === product.id);
        setIsInWishlist(exists);
      } catch (err) {
        console.error('Lỗi kiểm tra wishlist:', err);
      }
    };
    checkWishlistStatus();
  }, [product, isAuthenticated]);

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
      message.error(e.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      message.error('Vui lòng đăng nhập để sử dụng danh sách yêu thích');
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
        message.success({
          content: 'Đã thêm vào danh sách yêu thích',
          icon: <HeartFilled style={{ color: '#ff4d4f' }} />,
        });
      }
    } catch (e) {
      if (e.message === 'ALREADY_IN_WISHLIST') {
        setIsInWishlist(true);
        message.info('Sản phẩm đã có trong danh sách yêu thích');
      } else {
        message.error(e.message || 'Có lỗi xảy ra, vui lòng thử lại');
        // Check lại để sync trạng thái
        const wishlist = await WishlistService.getWishlist().catch(() => []);
        setIsInWishlist(wishlist.some(item => item.id === product.id));
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  // Xử lý gửi đánh giá
  const handleSubmitReview = async () => {
    if (!newReview.rating || !newReview.content.trim()) {
      message.warning('Vui lòng chọn số sao và viết nội dung đánh giá');
      return;
    }

    setSubmittingReview(true);

    try {
      // Gửi đánh giá lên server
      const savedReview = await ProductCatalogService.addReview(product.id, {
        rating: newReview.rating,
        body: newReview.content.trim(),
      });

      message.success('Đánh giá của bạn đã được gửi thành công!');

      // Cập nhật giao diện ngay lập tức mà không cần reload
      setProduct(prev => ({
        ...prev,
        reviews: [savedReview, ...(prev.reviews || [])],
        reviewCount: (prev.reviewCount || 0) + 1,
      }));

      // Reset form
      setNewReview({ rating: 0, content: '' });

    } catch (err) {
      console.error(err);
      message.error('Gửi đánh giá thất bại, vui lòng thử lại');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />;
  if (!product) return <Alert message="Sản phẩm không tồn tại" type="info" showIcon style={{ margin: 24 }} />;

  return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            {/* --- ẢNH CHÍNH ĐƯỢC CẬP NHẬT --- */}
            <Image
                width="100%"
                src={getImageUrl(product.defaultImage)}
                alt={product.name}
                fallback="https://via.placeholder.com/400?text=Image+Error"
            />

            {/* --- LIST ẢNH NHỎ ĐƯỢC CẬP NHẬT --- */}
            <Space style={{ marginTop: 12, overflowX: 'auto', width: '100%' }}>
              {(product.images || []).map(img => (
                  <div key={img.id} style={{ border: '1px solid #ddd', padding: 2, cursor: 'pointer' }}>
                    <Image
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover' }}
                        src={getImageUrl(img.url)}
                        alt="thumbnail"
                        preview={true} // Cho phép click để phóng to
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

            <Paragraph>{product.description || 'Chưa có mô tả'}</Paragraph>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* SKU & Tồn kho */}
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>SKU: </Text>
                  <Text strong>{selectedVariant?.sku || 'N/A'}</Text>
                </div>
                {selectedVariant?.stockQuantity !== null && (
                    <div>
                      <Text strong>Tồn kho: </Text>
                      <Tag color={selectedVariant.stockQuantity > 0 ? 'green' : 'red'}>
                        {selectedVariant.stockQuantity} sản phẩm
                      </Tag>
                    </div>
                )}
              </div>

              {/* Giá */}
              <div>
                <Text strong>Giá: </Text>
                {selectedVariant?.salePrice && selectedVariant.salePrice < selectedVariant.price ? (
                    <Space>
                      <Text delete type="secondary">{selectedVariant.price.toLocaleString('vi-VN')} ₫</Text>
                      <Text strong type="danger" style={{ fontSize: 22 }}>
                        {selectedVariant.salePrice.toLocaleString('vi-VN')} ₫
                      </Text>
                    </Space>
                ) : (
                    <Text strong style={{ fontSize: 22 }}>
                      {selectedVariant?.price?.toLocaleString('vi-VN') || '0'} ₫
                    </Text>
                )}
              </div>

              {/* Biến thể */}
              <div>
                <Text strong>Biến thể:</Text>
                <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={selectedVariantId}
                    onChange={(value) => {
                      setSelectedVariantId(value);
                      setQuantity(1);
                    }}
                >
                  {(product.variants || []).map(v => (
                      <Option key={v.id} value={v.id}>
                        {v.sku} - {v.attributes || 'Mặc định'} {v.stockQuantity != null ? `(Còn ${v.stockQuantity})` : ''}
                      </Option>
                  ))}
                </Select>
              </div>

              {/* Số lượng */}
              <div>
                <Text strong>Số lượng:</Text>
                <InputNumber
                    min={1}
                    max={selectedVariant?.stockQuantity || 99}
                    value={quantity}
                    onChange={setQuantity}
                    style={{ marginLeft: 12, width: 120 }}
                />
              </div>

              {/* Nút hành động */}
              <Space size="middle">
                <Button
                    type="primary"
                    size="large"
                    onClick={handleAddToCart}
                    loading={addingToCart}
                    disabled={!selectedVariantId}
                >
                  Thêm vào giỏ
                </Button>

                {isAuthenticated && (
                    <Button
                        type={isInWishlist ? 'primary' : 'default'}
                        danger={isInWishlist}
                        icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                        loading={wishlistLoading}
                        onClick={handleFavorite}
                        style={{
                          background: isInWishlist ? '#ff4d4f' : undefined,
                          borderColor: isInWishlist ? '#ff4d4f' : undefined,
                          color: isInWishlist ? 'white' : undefined,
                        }}
                    >
                      {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                    </Button>
                )}
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Tabs thông tin chi tiết */}
        <Card style={{ marginTop: 24 }}>
          <Tabs
              items={[
                {
                  key: 'desc',
                  label: 'Mô tả',
                  children: <Paragraph>{product.description || 'Chưa có mô tả'}</Paragraph>,
                },
                {
                  key: 'specs',
                  label: 'Đặc tính kỹ thuật',
                  children: <Paragraph>{product.technicalSpecs || 'Chưa có thông tin đặc tính kỹ thuật'}</Paragraph>,
                },
                {
                  key: 'reviews',
                  label: `Đánh giá (${product.reviewCount || 0})`,
                  children: (
                      <Space direction="vertical" style={{ width: '100%' }} size="large">

                        {/* Form gửi đánh giá */}
                        {isAuthenticated ? (
                            <Card title="Viết đánh giá của bạn">
                              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <div>
                                  <Text strong style={{ marginRight: 12 }}>Chọn số sao:</Text>
                                  <Rate
                                      value={newReview.rating}
                                      onChange={(value) => setNewReview(prev => ({ ...prev, rating: value }))}
                                      style={{ fontSize: 28 }}
                                  />
                                  {newReview.rating > 0 && (
                                      <Text type="secondary" style={{ marginLeft: 10 }}>
                                        {newReview.rating} sao
                                      </Text>
                                  )}
                                </div>

                                <TextArea
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    value={newReview.content}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                                />

                                <Button
                                    type="primary"
                                    onClick={handleSubmitReview}
                                    loading={submittingReview}
                                    disabled={!newReview.rating || !newReview.content.trim()}
                                >
                                  Gửi đánh giá
                                </Button>
                              </Space>
                            </Card>
                        ) : (
                            <Alert
                                message="Bạn cần đăng nhập để viết đánh giá"
                                type="info"
                                showIcon
                                action={
                                  <Button type="primary" size="small" onClick={() => navigate('/login')}>
                                    Đăng nhập ngay
                                  </Button>
                                }
                            />
                        )}

                        {/* Danh sách đánh giá */}
                        {product.reviews && product.reviews.length > 0 ? (
                            <Space direction="vertical" style={{ width: '100%' }}>
                              {product.reviews.map(r => (
                                  <Card key={r.id} size="small">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text strong>{r.userName || 'Khách hàng'}</Text>
                                        <Rate disabled value={r.rating} style={{ fontSize: 16 }} />
                                      </div>
                                      <Paragraph style={{ margin: '8px 0 0', color: '#555' }}>
                                        {r.body}
                                      </Paragraph>
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                      </Text>
                                    </Space>
                                  </Card>
                              ))}
                            </Space>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                            </div>
                        )}
                      </Space>
                  ),
                },
                {
                  key: 'qa',
                  label: 'Câu hỏi & Trả lời',
                  children: <div>Chức năng câu hỏi & trả lời sẽ được thêm vào sau.</div>,
                },
              ]}
          />
        </Card>
      </div>
  );
};

export default ProductDetailPage;