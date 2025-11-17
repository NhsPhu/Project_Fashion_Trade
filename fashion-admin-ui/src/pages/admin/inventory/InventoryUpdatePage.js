// src/pages/inventory/InventoryUpdatePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InventoryService from '../../../services/admin/InventoryService';
import ApiService from '../../../services/ApiService';
import { Form, Button, InputNumber, Select, Typography, notification, Card, Spin } from 'antd';

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
                // BƯỚC 1: GỌI API WAREHOUSES
                console.log('Gọi API /api/v1/admin/warehouses...');
                const response = await ApiService.get('/api/v1/admin/warehouses');
                console.log('Response từ API:', response); // DEBUG

                // XỬ LÝ RESPONSE (ApiService có thể trả data hoặc response.data)
                const warehouseList = response?.data || response || [];
                console.log('Danh sách kho:', warehouseList);

                if (!Array.isArray(warehouseList) || warehouseList.length === 0) {
                    notification.warning({
                        message: 'Không có kho nào',
                        description: 'API trả về rỗng. Kiểm tra backend.'
                    });
                    setWarehouses([]);
                    setLoading(false);
                    return;
                }

                setWarehouses(warehouseList);

                // BƯỚC 2: TÌM TỒN KHO
                let found = false;
                for (const wh of warehouseList) {
                    try {
                        const stockRes = await InventoryService.getStock(variantId, wh.id);
                        console.log(`Tồn kho tại ${wh.name}:`, stockRes.quantity);
                        form.setFieldsValue({
                            warehouseId: wh.id,
                            quantity: stockRes.quantity || 0,
                            action: 'IN'
                        });
                        setCurrentStock(stockRes.quantity || 0);
                        found = true;
                        break;
                    } catch (err) {
                        console.log(`Không có tồn kho tại kho ${wh.name}`);
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
                console.error('Lỗi khi gọi API warehouses:', err);
                const status = err.response?.status;
                const msg = err.response?.data?.message || err.message;

                if (status === 403) {
                    notification.error({ message: 'Không có quyền', description: 'Bạn không có quyền xem kho.' });
                } else if (status === 404) {
                    notification.error({ message: 'API không tồn tại', description: '/api/v1/admin/warehouses không hoạt động.' });
                } else {
                    notification.error({ message: 'Lỗi tải kho', description: `${status}: ${msg}` });
                }
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
                variantId: parseInt(variantId),
                warehouseId: values.warehouseId,
                quantity: values.quantity,
                action: values.action
            });
            notification.success({ message: 'Cập nhật tồn kho thành công!' });
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
        return <Spin tip="Đang tải danh sách kho..." size="large" style={{ display: 'block', marginTop: 100 }} />;
    }

    return (
        <Card style={{ maxWidth: 600, margin: '40px auto' }}>
            <Title level={3}>Cập nhật tồn kho (Variant ID: {variantId})</Title>

            {currentStock !== null && (
                <div style={{ marginBottom: 16, color: '#888' }}>
                    Tồn kho hiện tại: <strong style={{ color: '#1890ff' }}>{currentStock}</strong>
                </div>
            )}

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="warehouseId"
                    label="* Kho"
                    rules={[{ required: true, message: 'Vui lòng chọn kho!' }]}
                >
                    <Select placeholder="Chọn kho">
                        {warehouses.map(wh => (
                            <Select.Option key={wh.id} value={wh.id}>
                                {wh.name} {wh.location ? `(${wh.location})` : ''}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="action"
                    label="* Hành động"
                    rules={[{ required: true, message: 'Vui lòng chọn hành động!' }]}
                >
                    <Select placeholder="Chọn hành động">
                        <Select.Option value="IN">Nhập kho</Select.Option>
                        <Select.Option value="OUT">Xuất kho</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="* Số lượng"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượng!' },
                        { type: 'number', min: 1, message: 'Số lượng phải ≥ 1' }
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating} block size="large">
                        Thực hiện
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default InventoryUpdatePage;