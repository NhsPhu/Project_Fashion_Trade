// src/pages/inventory/InventoryUpdatePage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InventoryService from '../../../services/admin/InventoryService';
import ApiService from '../../../services/ApiService';
import {
    Form,
    Button,
    InputNumber,
    Select,
    Typography,
    notification,
    Card,
    Space,
} from 'antd';

const { Title } = Typography;
const { Option } = Select;

const InventoryUpdatePage = () => {
    const navigate = useNavigate();
    const { variantId: vId } = useParams();
    const variantId = parseInt(vId, 10);

    const formRef = useRef();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [currentStock, setCurrentStock] = useState(0);

    const loadStockForWarehouse = useCallback(
        async (warehouseId) => {
            if (!warehouseId || !variantId) return;
            try {
                const res = await InventoryService.getStock(variantId, warehouseId);
                setCurrentStock(res.quantity || 0);
            } catch (err) {
                setCurrentStock(0);
            }
        },
        [variantId]
    );

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // ĐÚNG URL – chỉ 1 lần /admin
                const res = await ApiService.get('/admin/warehouses');
                const list = Array.isArray(res.data) ? res.data : res;

                if (list.length === 0) {
                    notification.warning({ message: 'Không có kho nào trong hệ thống!' });
                    setLoading(false);
                    return;
                }

                setWarehouses(list);

                const defaultWh = list[0];

                // Gọi trực tiếp, không dùng setTimeout → hết lỗi 403
                form.setFieldsValue({
                    warehouseId: defaultWh.id,
                    action: 'IN',
                    quantity: 1,
                });

                await loadStockForWarehouse(defaultWh.id);
            } catch (err) {
                console.error('Lỗi tải danh sách kho:', err);
                notification.error({ message: 'Không thể tải danh sách kho' });
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [variantId, form, loadStockForWarehouse]);

    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            const payload = {
                variantId,
                warehouseId: Number(values.warehouseId),
                action: values.action,
                quantity: Number(values.quantity),
            };

            console.log('Gửi cập nhật tồn kho:', payload);

            await InventoryService.updateStock(payload);

            notification.success({
                message: 'Thành công!',
                description: `Đã ${values.action === 'IN' ? 'nhập' : 'xuất'} kho thành công.`,
            });

            navigate('/admin/inventory');
        } catch (err) {
            console.error('Lỗi cập nhật tồn kho:', err);
            notification.error({
                message: 'Cập nhật thất bại',
                description: err.response?.data?.message || err.message || 'Lỗi không xác định',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card
            title={<Title level={3}>Cập nhật tồn kho - Variant ID: {variantId}</Title>}
            loading={loading}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ fontSize: 18, color: '#595959' }}>
                    Tồn kho hiện tại:{' '}
                    <strong style={{ fontSize: 32, color: '#1890ff' }}>
                        {currentStock}
                    </strong>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish} ref={formRef}>
                    <Form.Item
                        name="warehouseId"
                        label="Kho"
                        rules={[{ required: true, message: 'Vui lòng chọn kho!' }]}
                    >
                        <Select
                            placeholder="Chọn kho"
                            onChange={loadStockForWarehouse}
                            showSearch
                            optionFilterProp="children"
                        >
                            {warehouses.map((wh) => (
                                <Option key={wh.id} value={wh.id}>
                                    {wh.name} {wh.location ? `(${wh.location})` : ''}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="action"
                        label="Hành động"
                        initialValue="IN"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Option value="IN">Nhập kho</Option>
                            <Option value="OUT">Xuất kho</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            { type: 'number', min: 1, message: 'Số lượng phải ≥ 1' },
                        ]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                            block
                            size="large"
                        >
                            Thực hiện
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </Card>
    );
};

export default InventoryUpdatePage;