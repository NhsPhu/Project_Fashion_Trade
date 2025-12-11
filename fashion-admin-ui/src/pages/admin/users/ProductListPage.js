// src/pages/user/ProductListPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Input, Select, Pagination, Space, Typography, Spin, Button, message } from 'antd'; // Thêm message
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import './ProductListPage.css';

const { Option } = Select;
const { Title } = Typography;

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

  // 1. SỬA LỖI ẢNH: Dùng link này thay cho via.placeholder
  const PLACEHOLDER_IMG = 'https://placehold.co/250x250?text=No+Image';
  const IMAGE_BASE_URL = '/product_image/img/';

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
      // message.error('Không thể tải danh sách sản phẩm'); // Bật lên nếu muốn hiện thông báo lỗi
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

  // 2. HÀM XỬ LÝ ẢNH AN TOÀN
  const getImageUrl = (imageName) => {
    if (!imageName) return PLACEHOLDER_IMG;
    if (imageName.startsWith('http')) return imageName;
    return `${IMAGE_BASE_URL}${imageName}`;
  };

  return (
      <div className="product-list-page">
        <div className="product-list-header">
          <Title level={2}>Danh sách sản phẩm</Title>
          <Space>
            {/* 3. SỬA LỖI GIAO DIỆN: Dùng Space.Compact thay vì Input.Search */}
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
                defaultValue={filters.sort}
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
                {products.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                      <Card
                          hoverable
                          cover={
                            <img
                                alt={product.name}
                                src={getImageUrl(product.defaultImage)}
                                style={{ height: 250, objectFit: 'cover' }}
                                // 4. SỬA LỖI ẢNH CHẾT: Tự động chuyển sang ảnh mẫu nếu lỗi
                                onError={(e) => {
                                  if (e.target.src !== PLACEHOLDER_IMG) {
                                    e.target.onerror = null;
                                    e.target.src = PLACEHOLDER_IMG;
                                  }
                                }}
                            />
                          }
                          onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Card.Meta
                            title={<div style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{product.name}</div>}
                            description={
                              <Space direction="vertical" size="small">
                                <span style={{ fontWeight: 'bold' }}>
                                  {product.minPrice?.toLocaleString('vi-VN') || 'LH'} ₫
                                </span>
                              </Space>
                            }
                        />
                      </Card>
                    </Col>
                ))}
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