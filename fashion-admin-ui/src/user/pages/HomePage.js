import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Carousel, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import './HomePage.css';

const { Title, Paragraph } = Typography;

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
        console.log('HomePage products response:', response);
        setFeaturedProducts(response.content || []);
      } catch (error) {
        console.error('Error loading products:', error);
        console.error('Error details:', error.response?.data || error.message);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const carouselImages = [
    {
      title: 'DÙ CHỈ 1 LY',
      subtitle: 'Áp dụng cho đơn hàng từ 18K, có tối thiểu 1 ly nước bất kì',
      buttonText: 'Nhập mã FREESHIP2025',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'SALE LỚN',
      subtitle: 'Giảm giá lên đến 50% cho tất cả sản phẩm',
      buttonText: 'Mua ngay',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  return (
    <div className="home-page">
      <Carousel autoplay className="home-carousel">
        {carouselImages.map((item, index) => (
          <div key={index}>
            <div className="carousel-slide" style={{ background: item.background }}>
              <div className="carousel-content">
                <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>
                  {item.subtitle}
                </Paragraph>
                <Button type="primary" size="large" style={{ backgroundColor: '#fff', color: '#333' }}>
                  {item.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <div className="home-container">
        <Title level={2} style={{ textAlign: 'center', marginTop: 48, marginBottom: 32 }}>
          Sản phẩm nổi bật
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: '#999' }}>Chưa có sản phẩm nổi bật</p>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {featuredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.defaultImage || '/placeholder.jpg'}
                      style={{ height: 200, objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                    />
                  }
                  onClick={() => navigate(`/user/products/${product.id}`)}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <Space direction="vertical" size="small">
                        <span>
                          {product.minSalePrice && product.minSalePrice > 0 && product.minSalePrice !== product.minPrice ? (
                            <>
                              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                {product.minSalePrice.toLocaleString('vi-VN')} ₫
                              </span>
                              <span style={{ textDecoration: 'line-through', marginLeft: 8, color: '#999' }}>
                                {product.minPrice?.toLocaleString('vi-VN') || '0'} ₫
                              </span>
                            </>
                          ) : (
                            <span style={{ fontWeight: 'bold' }}>
                              {product.minPrice?.toLocaleString('vi-VN') || '0'} ₫
                            </span>
                          )}
                        </span>
                        {product.averageRating && product.averageRating > 0 && (
                          <span>⭐ {product.averageRating.toFixed(1)} ({product.reviewCount || 0} đánh giá)</span>
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
          <Button type="primary" size="large" onClick={() => navigate('/user/products')}>
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

