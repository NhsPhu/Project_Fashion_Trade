// src/pages/inventory/InventoryUpdatePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InventoryService from '../../services/InventoryService';
import { Form, Button, Input, Typography, notification, Card, Spin } from 'antd';

const { Title } = Typography;

function InventoryUpdatePage() {
    const navigate = useNavigate();
    const { variantId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadVariant = async () => {
            try {
                const data = await InventoryService.getStock(variantId);
                form.setFieldsValue({ quantity: data.currentStock }); // SỬA: currentStock
            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
            } finally {
                setLoading(false);
            }
        };
        loadVariant();
    }, [variantId, form]);

    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            await InventoryService.updateStock({ variantId, quantity: values.quantity });
            notification.success({ message: 'Cập nhật tồn kho thành công!' });
            navigate('/admin/inventory');
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <Spin tip="Đang tải..." size="large" style={{ display: 'block', marginTop: 100 }} />;
    }

    return (
        <Card style={{ maxWidth: 600, margin: '40px auto' }}>
            <Title level={3}>Cập nhật tồn kho (ID: {variantId})</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="quantity" label="Số lượng tồn kho" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating} block>
                        Lưu Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default InventoryUpdatePage;