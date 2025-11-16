import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Input, Select, Button, Pagination, Space, Typography, Spin } from 'antd';
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
      // Remove null values from params
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
      console.error('Error details:', error.response?.data || error.message);
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
                    <img
                      alt={product.name}
                      src={product.defaultImage || '/placeholder.jpg'}
                      style={{ height: 250, objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/250x250?text=No+Image';
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
                          <span>⭐ {product.averageRating.toFixed(1)} ({product.reviewCount || 0})</span>
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
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ProductListPage;

