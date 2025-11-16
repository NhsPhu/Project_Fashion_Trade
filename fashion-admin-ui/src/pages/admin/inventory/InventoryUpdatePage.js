// src/pages/inventory/InventoryUpdatePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InventoryService from '../../../services/admin/InventoryService';
import { Form, Button, InputNumber, Select, Typography, notification, Card, Spin } from 'antd';
import axios from 'axios';

const { Title } = Typography;

function InventoryUpdatePage() {
    const navigate = useNavigate();
    const { variantId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [currentStock, setCurrentStock] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // SỬA: GỌI ĐÚNG API + THÊM TOKEN
                const token = localStorage.getItem('token');
                const whRes = await axios.get('/api/v1/admin/warehouses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const warehouseList = whRes.data;
                setWarehouses(warehouseList);

                if (warehouseList.length === 0) {
                    throw new Error("Không có kho nào");
                }

                // TÌM TỒN KHO TRONG TẤT CẢ KHO
                let found = false;
                for (const wh of warehouseList) {
                    try {
                        const res = await InventoryService.getStock(variantId, wh.id);
                        form.setFieldsValue({
                            warehouseId: wh.id,
                            quantity: res.quantity,
                            action: 'IN'
                        });
                        setCurrentStock(res.quantity);
                        found = true;
                        break;
                    } catch (err) {
                        continue;
                    }
                }

                if (!found) {
                    form.setFieldsValue({
                        warehouseId: warehouseList[0].id,
                        quantity: 0,
                        action: 'IN'
                    });
                    setCurrentStock(0);
                }

            } catch (err) {
                notification.error({
                    message: 'Lỗi tải dữ liệu',
                    description: err.response?.data?.message || err.message
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [variantId, form]);

    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            await InventoryService.updateStock({
                variantId: Number(variantId),
                warehouseId: values.warehouseId,
                quantity: values.quantity,
                action: values.action
            });
            notification.success({ message: 'Cập nhật thành công!' });
            navigate('/admin/inventory');
        } catch (err) {
            notification.error({
                message: 'Cập nhật thất bại',
                description: err.response?.data?.message || err.message
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <Spin tip="Đang tải..." size="large" style={{ display: 'block', marginTop: 100 }} />;
    }

    return (
        <Card style={{ maxWidth: 600, margin: '40px auto' }}>
            <Title level={3}>Cập nhật tồn kho (Variant ID: {variantId})</Title>
            {currentStock !== null && (
                <div style={{ marginBottom: 16, color: '#888' }}>
                    Tồn kho hiện tại: <strong>{currentStock}</strong>
                </div>
            )}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="warehouseId" label="* Kho" rules={[{ required: true }]}>
                    <Select placeholder="Chọn kho">
                        {warehouses.map(wh => (
                            <Select.Option key={wh.id} value={wh.id}>
                                {wh.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="action" label="* Hành động" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="IN">Nhập kho</Select.Option>
                        <Select.Option value="OUT">Xuất kho</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="quantity" label="* Số lượng" rules={[{ required: true, type: 'number', min: 1 }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating} block>
                        Thực hiện
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default InventoryUpdatePage;