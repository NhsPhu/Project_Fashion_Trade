// src/user/pages/HomePage.js
import React from 'react';
import { Typography, Row, Col, Button, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Áo thun', img: 'https://picsum.photos/400/500?random=1' },
        { name: 'Áo sơ mi', img: 'https://picsum.photos/400/500?random=2' },
        { name: 'Quần jeans', img: 'https://picsum.photos/400/500?random=3' },
        { name: 'Váy & Đầm', img: 'https://picsum.photos/400/500?random=4' },
        { name: 'Áo khoác', img: 'https://picsum.photos/400/500?random=5' },
        { name: 'Phụ kiện', img: 'https://picsum.photos/400/500?random=6' },
    ];

    return (
        <>
            {/* HERO BANNER */}
            <div className="hero-banner">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <Title level={1} className="hero-title">THE FASHION HOUSE</Title>
                    <Paragraph className="hero-subtitle">
                        Nơi phong cách gặp gỡ cá tính
                    </Paragraph>
                    <Button type="primary" size="large" className="hero-cta" onClick={() => navigate('/products')}>
                        Khám phá bộ sưu tập
                    </Button>
                </div>
            </div>

            {/* DANH MỤC NHANH */}
            <div className="section-container">
                <Title level={2} className="section-title">Mua sắm theo phong cách</Title>
                <Row gutter={[24, 32]} justify="center">
                    {categories.map((cat, idx) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={idx}>
                            <div
                                className="category-card"
                                onClick={() => navigate(`/products?category=${cat.name}`)}
                            >
                                <div
                                    className="category-img"
                                    style={{ backgroundImage: `url(${cat.img})` }}
                                />
                                <Text strong className="category-label">{cat.name}</Text>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* PH�ấn GIỚI THIỆU THƯƠNG HIỆU – THAY THẾ HOÀN TOÀN PHẦN SẢN PHẨM */}
            <div className="about-section">
                <div className="section-container">
                    <Row gutter={[64, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <div className="about-image">
                                <img
                                    src="https://picsum.photos/800/1000?fashion=model"
                                    alt="THE FASHION HOUSE"
                                />
                            </div>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Title level={2} className="about-title">
                                Chào mừng đến với <span className="brand-highlight">THE FASHION HOUSE</span>
                            </Title>
                            <Paragraph className="about-text">
                                Được thành lập từ năm 2020, chúng tôi không chỉ bán quần áo – chúng tôi mang đến
                                <strong> phong cách sống</strong>, sự <strong>tự tin</strong> và <strong>cá tính riêng</strong>
                                cho từng khách hàng.
                            </Paragraph>
                            <Paragraph className="about-text">
                                Mỗi thiết kế đều được chăm chút từ chất liệu cao cấp, đường may tinh tế,
                                đến kiểu dáng dẫn đầu xu hướng – giúp bạn luôn nổi bật trong mọi khoảnh khắc.
                            </Paragraph>

                            <div className="stats-row">
                                <div className="stat-item">
                                    <Title level={1} className="stat-number">50K+</Title>
                                    <Text className="stat-label">Khách hàng tin tưởng</Text>
                                </div>
                                <div className="stat-item">
                                    <Title level={1} className="stat-number">300+</Title>
                                    <Text className="stat-label">Mẫu thiết kế mới mỗi tháng</Text>
                                </div>
                                <div className="stat-item">
                                    <Title level={1} className="stat-number">64</Title>
                                    <Text className="stat-label">Tỉnh thành giao hàng</Text>
                                </div>
                            </div>

                            <Divider />

                            <Title level={3} className="mission-title">Sứ mệnh của chúng tôi</Title>
                            <Paragraph className="mission-text">
                                “Mang thời trang chất lượng quốc tế đến gần hơn với mọi người Việt Nam
                                – với giá hợp lý và dịch vụ tận tâm.”
                            </Paragraph>

                            <Button
                                type="primary"
                                size="large"
                                className="about-cta"
                                onClick={() => navigate('/about')}
                            >
                                Tìm hiểu thêm về chúng tôi
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* BANNER KHUYẾN MÃI NHỎ */}
            <div className="promo-bottom">
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    FREESHIP TOÀN QUỐC • ĐƠN TỪ 399K
                </Title>
                <Text style={{ color: 'white', fontSize: 16 }}>
                    + Giảm thêm 10% cho đơn hàng đầu tiên
                </Text>
            </div>
        </>
    );
};

export default HomePage;