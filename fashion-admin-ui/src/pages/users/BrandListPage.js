// src/user/pages/BrandListPage.js
import React, { useEffect, useState } from 'react';
import { List, Card, Spin, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../services/user/BrandService';

const BrandListPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        BrandService.getAll()
            .then(data => {
                setBrands(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                message.error('Không thể tải thương hiệu');
                setBrands([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 48 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <Card title="Thương hiệu">
                <List
                    dataSource={brands}
                    renderItem={brand => (
                        <List.Item>
                            <Typography.Link
                                onClick={() => navigate(`/user/brands/${brand.slug}`)}
                                style={{ fontSize: 16 }}
                            >
                                {brand.name}
                            </Typography.Link>
                        </List.Item>
                    )}
                />
                {brands.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                        Chưa có thương hiệu nào
                    </div>
                )}
            </Card>
        </div>
    );
};

export default BrandListPage;