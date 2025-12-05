// src/pages/ProductListPage.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Input, Select, Pagination, Space, Typography, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import ProductCatalogService from '../../services/user/ProductCatalogService';
import './ProductListPage.css';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const ProductListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Lấy page từ URL, mặc định là 0
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

  // ĐƯỜNG DẪN GỐC TỚI THƯ MỤC ẢNH TRONG PUBLIC
  const IMAGE_BASE_URL = '/product_image/img/';

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.search, filters.sort, filters.categoryId, filters.brandId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        ...filters,
      };
      // Loại bỏ các key có giá trị null
      Object.keys(params).forEach(key => params[key] === null && delete params[key]);

      const response = await ProductCatalogService.getProducts(params);
      console.log('Products response:', response);

      setProducts(response.content || []);
      setTotal(response.totalElements || 0);

      if (response.content && response.content.length === 0) {
        console.warn('No products found');
      }

    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    setPage(0);
    updateSearchParams({ ...filters, search: value, page: 0 });
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
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  // --- HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH MỚI ---
  const getImageUrl = (imageName) => {
    if (!imageName) return '/placeholder.jpg'; // Ảnh mặc định nếu null
    if (imageName.startsWith('http')) return imageName; // Nếu DB lưu link online (ví dụ ảnh cũ)
    return `${IMAGE_BASE_URL}${imageName}`; // Ghép đường dẫn public với tên file
  };

  return (
      <div className="product-list-page">
        <div className="product-list-header">
          <Title level={2}>Danh sách sản phẩm</Title>
          <Space>
            <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                style={{ width: 300 }}
                onSearch={handleSearch}
                defaultValue={filters.search}
            />
            <Select
                defaultValue={filters.sort}
                style={{ width: 200 }}
                onChange={handleSortChange}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="name_asc">Tên A-Z</Option>
              <Option value="name_desc">Tên Z-A</Option>
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
                            // --- CẬP NHẬT PHẦN HIỂN THỊ ẢNH ---
                            <img
                                alt={product.name}
                                src={getImageUrl(product.defaultImage)}
                                style={{ height: 250, objectFit: 'cover' }}
                                onError={(e) => {
                                  // Nếu ảnh lỗi thì hiển thị ảnh placeholder online
                                  e.target.src = 'https://via.placeholder.com/250x250?text=No+Image';
                                }}
                            />
                          }
                          // Điều hướng tới trang chi tiết
                          onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Card.Meta
                            title={<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>}
                            description={
                              <Space direction="vertical" size="small">
                                <span>
                                  {product.minSalePrice && product.minSalePrice > 0 && product.minSalePrice < product.minPrice ? (
                                      <>
                                      <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                        {product.minSalePrice.toLocaleString('vi-VN')} ₫
                                      </span>
                                        <span style={{ textDecoration: 'line-through', marginLeft: 8, color: '#999', fontSize: '12px' }}>
                                        {product.minPrice?.toLocaleString('vi-VN') || '0'} ₫
                                      </span>
                                      </>
                                  ) : (
                                      <span style={{ fontWeight: 'bold' }}>
                                      {product.minPrice?.toLocaleString('vi-VN') || 'Đang cập nhật'} ₫
                                    </span>
                                  )}
                                </span>
                                {product.averageRating > 0 && (
                                    <span style={{ fontSize: '12px', color: '#faad14' }}>
                                      ⭐ {product.averageRating.toFixed(1)} ({product.reviewCount || 0} đánh giá)
                                    </span>
                                )}
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