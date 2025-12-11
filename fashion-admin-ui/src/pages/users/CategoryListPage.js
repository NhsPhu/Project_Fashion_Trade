// src/user/pages/CategoryListPage.js
import React, { useEffect, useState } from 'react';
import { List, Card, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/user/CategoryService'; // ← Tạo sau

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getAll()
            .then(data => {
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                message.error('Không thể tải danh mục');
                setCategories([]);
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
            <Card title="Danh mục sản phẩm">
                <List
                    dataSource={categories}
                    renderItem={cat => (
                        <List.Item>
                            <a
                                onClick={() => navigate(`/user/categories/${cat.slug}`)}
                                style={{ fontSize: 16 }}
                            >
                                {cat.name} {cat.productCount > 0 && `(${cat.productCount} sản phẩm)`}
                            </a>
                        </List.Item>
                    )}
                />
                {categories.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                        Chưa có danh mục nào
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CategoryListPage;