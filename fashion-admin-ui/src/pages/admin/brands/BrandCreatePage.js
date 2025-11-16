import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../../services/admin/BrandService';
import { Form, Button, Input, Typography, notification, Card } from 'antd';

const { Title } = Typography;

function BrandCreatePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await BrandService.createBrand(values);
            notification.success({ message: 'Tạo thương hiệu thành công!' });
            navigate('/admin/brands');
        } catch (err) {
            notification.error({ message: 'Tạo thất bại', description: err.message });
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 600, margin: 'auto' }}>
            <Title level={3}>Tạo Thương hiệu mới</Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Tên Thương hiệu" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu Thương hiệu
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default BrandCreatePage;