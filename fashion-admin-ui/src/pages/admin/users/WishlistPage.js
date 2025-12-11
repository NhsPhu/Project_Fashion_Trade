// src/user/pages/WishlistPage.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, Row, Col, Button, Space, message, Spin,
  Modal, Select, InputNumber, Tag, Alert, Typography
} from 'antd';
import { useNavigate } from 'react-router-dom';
import WishlistService from '../../services/user/WishlistService';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import { useUserCart } from '../../contexts/UserCartContext';

const { Option } = Select;
const { Paragraph } = Typography;

const WishlistPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useUserCart();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // --- CẤU HÌNH ĐƯỜNG DẪN ẢNH ---
  const IMAGE_BASE_URL = '/product_image/img/';

  const getImageUrl = (imageName) => {
    if (!imageName) return 'https://via.placeholder.com/220?text=No+Image';
    if (imageName.startsWith('http')) return imageName; // Nếu là link online cũ
    return `${IMAGE_BASE_URL}${imageName}`; // Ghép đường dẫn local
  };
  // ------------------------------

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await WishlistService.getWishlist();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error('Không thể tải danh sách yêu thích');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const openAddToCartModal = async (product) => {
    setLoadingProduct(true);
    setModalVisible(true);
    setSelectedProduct(product);
    setSelectedVariantId(null);
    setQuantity(1);

    try {
      const fullProduct = await ProductCatalogService.getProductById(product.id);
      setSelectedProduct(fullProduct);

      // Chọn biến thể đầu tiên (có hàng) nếu có
      if (fullProduct?.variants?.length > 0) {
        const firstInStock = fullProduct.variants.find(v =>
            (v.stockQuantity ?? v.stock ?? v.quantity ?? 0) > 0
        );
        setSelectedVariantId((firstInStock || fullProduct.variants[0]).id);
      }
    } catch (err) {
      message.error('Không thể tải thông tin sản phẩm');
      setModalVisible(false);
    } finally {
      setLoadingProduct(false);
    }
  };

  const selectedVariant = useMemo(() => {
    return selectedProduct?.variants?.find(v => v.id === selectedVariantId) || null;
  }, [selectedProduct, selectedVariantId]);

  // Logic tồn kho giữ nguyên
  const currentStock = selectedVariant
      ? (selectedVariant.stockQuantity ?? selectedVariant.stock ?? selectedVariant.quantity ?? 0)
      : 0;

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      message.warning('Vui lòng chọn biến thể');
      return;
    }
    if (currentStock < quantity) {
      message.warning('Số lượng vượt quá tồn kho');
      return;
    }
    try {
      await addItem({ variantId: selectedVariantId, quantity });
      message.success('Đã thêm vào giỏ hàng');
      setModalVisible(false);
    } catch (e) {
      message.error(e.message || 'Thêm thất bại');
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await WishlistService.removeFromWishlist(id);
      await loadWishlist();
      message.success('Đã xóa khỏi yêu thích');
    } catch (e) {
      message.error('Xóa thất bại');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;

  return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2 style={{ fontSize: 24, marginBottom: 24 }}>Sản phẩm yêu thích</h2>

        {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <p style={{ fontSize: 18, color: '#999' }}>Chưa có sản phẩm yêu thích</p>
            </div>
        ) : (
            <Row gutter={[16, 24]}>
              {items.map(product => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                    <Card
                        hoverable
                        onClick={() => navigate(`/products/${product.id}`)}
                        cover={
                          // --- CẬP NHẬT PHẦN HIỂN THỊ ẢNH ---
                          <img
                              src={getImageUrl(product.defaultImage)}
                              alt={product.name}
                              style={{ height: 220, objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/220?text=Image+Error';
                              }}
                          />
                        }
                    >
                      <Card.Meta title={product.name} />
                      <Space direction="vertical" style={{ width: '100%', marginTop: 12 }}>
                        <Button
                            type="primary"
                            block
                            onClick={(e) => { e.stopPropagation(); openAddToCartModal(product); }}
                        >
                          Thêm vào giỏ
                        </Button>
                        <Button
                            danger
                            block
                            onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                        >
                          Bỏ yêu thích
                        </Button>
                      </Space>
                    </Card>
                  </Col>
              ))}
            </Row>
        )}

        {/* Modal chọn biến thể */}
        <Modal
            title={`Chọn biến thể cho ${selectedProduct?.name || ''}`}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleAddToCart}
            okText="Thêm vào giỏ"
            cancelText="Hủy"
            confirmLoading={loadingProduct}
            okButtonProps={{
              disabled: !selectedVariantId || currentStock <= 0 || currentStock < quantity
            }}
        >
          {loadingProduct ? (
              <div style={{ textAlign: 'center', padding: 32 }}><Spin /></div>
          ) : !selectedProduct?.variants?.length ? (
              <Alert message="Sản phẩm chưa có biến thể" type="warning" showIcon />
          ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Paragraph strong>Phân loại hàng:</Paragraph>
                  <Select
                      style={{ width: '100%' }}
                      value={selectedVariantId}
                      onChange={setSelectedVariantId}
                      placeholder="Chọn biến thể"
                  >
                    {selectedProduct.variants.map(v => {
                      const stock = v.stockQuantity ?? v.stock ?? v.quantity ?? 0;
                      const isOutOfStock = stock <= 0;

                      return (
                          <Option key={v.id} value={v.id} disabled={isOutOfStock}>
                            <Space>
                              {v.sku || 'N/A'}
                              {v.attributes?.size && ` - Size ${v.attributes.size}`}
                              {v.attributes?.color && ` - ${v.attributes.color}`}
                              {isOutOfStock ? (
                                  <Tag color="red">Hết hàng</Tag>
                              ) : (
                                  <Tag color="green">Còn {stock}</Tag>
                              )}
                            </Space>
                          </Option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <Paragraph strong>Số lượng:</Paragraph>
                  <InputNumber
                      min={1}
                      max={currentStock}
                      value={quantity}
                      onChange={setQuantity}
                      style={{ width: '100%' }}
                      disabled={currentStock <= 0}
                  />
                </div>

                <Alert
                    message={`Tồn kho: ${currentStock} sản phẩm`}
                    type={currentStock > 0 ? 'success' : 'error'}
                    showIcon
                />
              </Space>
          )}
        </Modal>
      </div>
  );
};

export default WishlistPage;