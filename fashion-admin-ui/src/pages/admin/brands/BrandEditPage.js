import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandService from '../../../services/admin/BrandService';
import { Form, Button, Input, Typography, notification, Card, Spin } from 'antd';

const { Title } = Typography;

function BrandEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadBrand = async () => {
            try {
                const data = await BrandService.getBrandById(id);
                form.setFieldsValue({ name: data.name, slug: data.slug });
            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
            } finally {
                setLoading(false);
            }
        };
        loadBrand();
    }, [id, form]);

    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            await BrandService.updateBrand(id, values);
            notification.success({ message: 'Cập nhật thương hiệu thành công!' });
            navigate('/admin/brands');
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <Spin tip="Đang tải dữ liệu..." size="large" fullscreen />;
    }

    return (
        <Card style={{ maxWidth: 600, margin: 'auto' }}>
            <Title level={3}>Chỉnh sửa Thương hiệu (ID: {id})</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Tên Thương hiệu" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating}>
                        Lưu Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default BrandEditPage;