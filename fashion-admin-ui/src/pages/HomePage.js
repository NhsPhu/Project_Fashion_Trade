import React, { useEffect, useState } from 'react';
// 1. ĐÃ XÓA 'Spin' KHỎI DÒNG IMPORT NÀY
import { Card, Row, Col, Button, Carousel, Typography, Space, Skeleton, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProductCatalogService from '../services/user/ProductCatalogService';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

// (Carousel items)
const carouselItems = [
  {
    title: 'Bộ Sưu Tập Mùa Hè 2025',
    subtitle: 'Giảm giá lên đến 50% cho các sản phẩm mới nhất.',
    buttonText: 'Mua ngay',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
  },
  {
    title: 'Thời Trang Công Sở',
    subtitle: 'Thanh lịch và chuyên nghiệp. Chất liệu cao cấp.',
    buttonText: 'Xem thêm',
    background: 'linear-gradient(to right, #f857a6, #ff5858)',
  }
];

// (Component LoadingSkeleton)
const LoadingSkeleton = () => (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 8 }).map((_, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card>
              <Skeleton.Image active style={{ height: 200, width: '100%' }} />
              <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 16 }} />
            </Card>
          </Col>
      ))}
    </Row>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductCatalogService.getProducts({
          page: 0,
          size: 8,
          sort: 'newest',
        });
        setFeaturedProducts(response.content || []);
      } catch (error) {
        console.error('Error loading products:', error);
        notification.error({
          message: 'Lỗi tải sản phẩm',
          description: error.response?.data?.message || error.message,
        });
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
      <div className="home-page">
        {/* Carousel */}
        <Carousel autoplay className="home-carousel">
          {carouselItems.map((item, index) => (
              <div key={index}>
                <div className="carousel-slide" style={{ background: item.background }}>
                  <div className="carousel-content">
                    <Title level={1} className="carousel-title">
                      {item.title}
                    </Title>
                    <Paragraph className="carousel-subtitle">
                      {item.subtitle}
                    </Paragraph>
                    <Button type="primary" size="large" className="carousel-button">
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
          ))}
        </Carousel>

        {/* Khu vực Sản phẩm */}
        <div className="home-container">
          <Title level={2} style={{ textAlign: 'center', marginTop: 48, marginBottom: 32 }}>
            Sản phẩm nổi bật
          </Title>

          {/* 2. Chúng ta đang dùng <LoadingSkeleton /> (không dùng <Spin />) */}
          {loading ? (
              <LoadingSkeleton />
          ) : featuredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <Text type="secondary">Chưa có sản phẩm nổi bật</Text>
              </div>
          ) : (
              <Row gutter={[16, 16]}>
                {featuredProducts.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                      <Card
                          hoverable
                          className="product-card"
                          cover={
                            <img
                                alt={product.name}
                                src={product.defaultImage || 'https://via.placeholder.com/300x300?text=No+Image'}
                                className="product-card-image"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                }}
                            />
                          }
                          onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Card.Meta
                            title={<div className="product-card-title">{product.name}</div>}
                            description={
                              <Space direction="vertical" size="small">
                                <div className="product-card-price">
                                  {product.minSalePrice && product.minSalePrice > 0 && product.minSalePrice !== product.minPrice ? (
                                      <>
                                        <Text strong type="danger">
                                          {formatCurrency(product.minSalePrice)}
                                        </Text>
                                        <Text delete type="secondary" style={{ marginLeft: 8 }}>
                                          {formatCurrency(product.minPrice)}
                                        </Text>
                                      </>
                                  ) : (
                                      <Text strong>
                                        {formatCurrency(product.minPrice)}
                                      </Text>
                                  )}
                                </div>
                                {product.averageRating && product.averageRating > 0 && (
                                    <Text type="secondary">⭐ {product.averageRating.toFixed(1)} ({product.reviewCount || 0})</Text>
                                )}
                              </Space>
                            }
                        />
                      </Card>
                    </Col>
                ))}
              </Row>
          )}

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button type="primary" size="large" onClick={() => navigate('/products')}>
              Xem tất cả sản phẩm
            </Button>
          </div>
        </div>
      </div>
  );
};

export default HomePage;