// pages/wishlists/WishlistPage.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Space, message, Spin, Empty } from 'antd';
import WishlistService from '../../../services/user/WishlistService';
import { useUserCart } from '../../contexts/UserCartContext';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useUserCart();

    const load = async () => {
        setLoading(true);
        try {
            const data = await WishlistService.getWishlist();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('Không thể tải danh sách yêu thích');
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const addToCart = async (product) => {
        try {
            const variant = (product.variants || [])[0];
            if (!variant) throw new Error('Sản phẩm không có biến thể');
            await addItem({ variantId: variant.id, quantity: 1 });
            message.success('Đã thêm vào giỏ hàng');
        } catch (e) {
            message.error(e.message || 'Không thể thêm vào giỏ');
        }
    };

    const remove = async (id) => {
        try {
            await WishlistService.removeFromWishlist(id);
            await load();
            message.success('Đã xóa khỏi yêu thích');
        } catch (e) {
            message.error('Không thể xóa');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <h2 style={{ fontSize: 24, marginBottom: 24 }}>Sản phẩm yêu thích</h2>

            {items.length === 0 ? (
                <Empty
                    description="Chưa có sản phẩm yêu thích"
                    style={{ margin: '48px 0' }}
                >
                    <Link to="/user/products">
                        <Button type="primary" size="large">
                            Xem sản phẩm ngay
                        </Button>
                    </Link>
                </Empty>
            ) : (
                <Row gutter={[16, 16]}>
                    {items.map(product => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        src={product.defaultImage || 'https://via.placeholder.com/220'}
                                        alt={product.name}
                                        style={{ height: 220, objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <Button type="primary" block onClick={() => addToCart(product)}>
                                        Thêm vào giỏ
                                    </Button>,
                                    <Button danger block onClick={() => remove(product.id)}>
                                        Bỏ yêu thích
                                    </Button>
                                ]}
                            >
                                <Card.Meta
                                    title={product.name}
                                    description={
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#d4380d' }}>
                                                {product.basePrice?.toLocaleString()} VND
                                            </p>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default WishlistPage;