// src/pages/user/ProductListPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Input, Select, Pagination, Space, Typography, Spin, Button, message, Tag, Rate } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import './ProductListPage.css';

const { Option } = Select;
const { Title, Text } = Typography;

const ProductListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [size] = useState(12);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    categoryId: searchParams.get('categoryId') || null,
    brandId: searchParams.get('brandId') || null,
    minPrice: searchParams.get('minPrice') || null,
    maxPrice: searchParams.get('maxPrice') || null,
  });

  const PLACEHOLDER_IMG = 'https://placehold.co/250x250?text=No+Image';
  const IMAGE_BASE_URL = '/product_image/img/';

  const getImageUrl = (imageName) => {
    if (!imageName) return PLACEHOLDER_IMG;
    if (imageName.startsWith('http')) return imageName;
    return `${IMAGE_BASE_URL}${imageName}`;
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size, ...filters };
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') delete params[key];
      });

      const response = await ProductCatalogService.getProducts(params);
      setProducts(response.content || []);
      setTotal(response.totalElements || 0);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const triggerSearch = () => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    setPage(0);
    updateSearchParams({ ...newFilters, page: 0 });
  };

  const handleSortChange = (value) => {
    setFilters({ ...filters, sort: value });
    setPage(0);
    updateSearchParams({ ...filters, sort: value, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
    updateSearchParams({ ...filters, page: newPage - 1 });
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  return (
      <div className="product-list-page">
        <div className="product-list-header">
          <Title level={2}>Danh sách sản phẩm</Title>
          <Space>
            <Space.Compact style={{ width: 300 }}>
              <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onPressEnter={triggerSearch}
                  allowClear
                  size="large"
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={triggerSearch} size="large" />
            </Space.Compact>

            <Select
                value={filters.sort}
                style={{ width: 200 }}
                onChange={handleSortChange}
                size="large"
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="name_asc">Tên A-Z</Option>
              <Option value="name_desc">Tên Z-A</Option>
              <Option value="price_asc">Giá tăng dần</Option>
              <Option value="price_desc">Giá giảm dần</Option>
            </Select>
          </Space>
        </div>

        <Spin spinning={loading}>
          {products.length === 0 && !loading ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <p style={{ fontSize: 18, color: '#999' }}>Không tìm thấy sản phẩm nào</p>
              </div>
          ) : (
              <Row gutter={[16, 16]}>
                {products.map((product) => {
                  const hasSale = product.minSalePrice && product.minSalePrice < product.minPrice;
                  const discountPercent = hasSale
                      ? Math.round(((product.minPrice - product.minSalePrice) / product.minPrice) * 100)
                      : 0;

                  return (
                      <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                        <Card
                            hoverable
                            cover={
                              <div style={{ position: 'relative' }}>
                                <img
                                    alt={product.name}
                                    src={getImageUrl(product.defaultImage)}
                                    style={{ height: 250, objectFit: 'cover', width: '100%' }}
                                    onError={(e) => {
                                      if (e.target.src !== PLACEHOLDER_IMG) {
                                        e.target.onerror = null;
                                        e.target.src = PLACEHOLDER_IMG;
                                      }
                                    }}
                                />
                                {hasSale && (
                                    <Tag color="red" style={{ position: 'absolute', top: 8, left: 8, fontWeight: 'bold' }}>
                                      -{discountPercent}%
                                    </Tag>
                                )}
                              </div>
                            }
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <Card.Meta
                              title={
                                <div style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  fontWeight: 'bold',
                                  fontSize: 15
                                }}>
                                  {product.name}
                                </div>
                              }
                              description={
                                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                  <div>
                                    {hasSale ? (
                                        <Space align="baseline">
                                          <Text strong style={{ fontSize: 19, color: '#ff4d4f' }}>
                                            {product.minSalePrice.toLocaleString('vi-VN')} ₫
                                          </Text>
                                          <Text delete type="secondary">
                                            {product.minPrice.toLocaleString('vi-VN')} ₫
                                          </Text>
                                        </Space>
                                    ) : (
                                        <Text strong style={{ fontSize: 18, color: '#d4380d' }}>
                                          {product.minPrice?.toLocaleString('vi-VN') || 'Liên hệ'} ₫
                                        </Text>
                                    )}
                                  </div>

                                  {product.averageRating > 0 && (
                                      <div style={{ fontSize: 13 }}>
                                        <Rate disabled allowHalf value={product.averageRating} style={{ fontSize: 13 }} />
                                        <Text type="secondary" style={{ marginLeft: 6 }}>
                                          ({product.reviewCount || 0})
                                        </Text>
                                      </div>
                                  )}
                                </Space>
                              }
                          />
                        </Card>
                      </Col>
                  );
                })}
              </Row>
          )}

          {total > 0 && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Pagination
                    current={page + 1}
                    total={total}
                    pageSize={size}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
              </div>
          )}
        </Spin>
      </div>
  );
};

export default ProductListPage;