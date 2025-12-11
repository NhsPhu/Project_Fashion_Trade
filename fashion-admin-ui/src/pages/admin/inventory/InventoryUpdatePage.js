// src/pages/inventory/InventoryUpdatePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InventoryService from '../../../services/admin/InventoryService';
import {
    Form,
    Button,
    InputNumber,
    Select,
    Typography,
    notification,
    Card,
    Space,
    Tag,
    Spin,
    Statistic,
} from 'antd';
import { ArrowLeftOutlined, StockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const InventoryUpdatePage = () => {
    const navigate = useNavigate();
    const { variantId: vId } = useParams();
    const variantId = parseInt(vId, 10);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [currentStock, setCurrentStock] = useState(0);

    // Cố định kho ID = 1
    const WAREHOUSE_ID = 1;

    const loadCurrentStock = useCallback(async () => {
        try {
            const res = await InventoryService.getStock(variantId, WAREHOUSE_ID);
            setCurrentStock(res.quantity || 0);
        } catch (err) {
            setCurrentStock(0);
        }
    }, [variantId]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            form.setFieldsValue({
                action: 'IN',
                quantity: 1,
            });
            await loadCurrentStock();
            setLoading(false);
        };
        init();
    }, [form, loadCurrentStock]);

    const onFinish = async (values) => {
        setUpdating(true);
        try {
            await InventoryService.updateStock({
                variantId,
                warehouseId: WAREHOUSE_ID,
                action: values.action,
                quantity: Number(values.quantity),
            });

            notification.success({
                message: 'Thành công!',
                description: `Đã ${values.action === 'IN' ? 'nhập' : 'xuất'} kho thành công.`,
                placement: 'top',
            });

            navigate('/admin/inventory');
        } catch (err) {
            notification.error({
                message: 'Thất bại',
                description: err.response?.data?.message || 'Có lỗi xảy ra',
                placement: 'top',
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, background: '#f9f9f9', minHeight: '100vh' }}>
            {/* Nút quay lại + tiêu đề */}
            <div style={{ marginBottom: 24 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/inventory')}
                    style={{ fontSize: 18 }}
                >
                    Quay lại danh sách
                </Button>
                <Title level={2} style={{ margin: '16px 0 0', color: '#1a1a1a' }}>
                    <StockOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                    Cập nhật tồn kho – Variant ID: {variantId}
                </Title>
            </div>

            {/* Card chính */}
            <Card style={{ maxWidth: 600, margin: '0 auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>

                    {/* Tồn kho hiện tại - nổi bật */}
                    <div style={{ textAlign: 'center', padding: '32px 0', background: '#f5faff', borderRadius: 12 }}>
                        <div style={{ fontSize: 18, color: '#595959', marginBottom: 12 }}>
                            Tồn kho hiện tại
                        </div>
                        <Statistic
                            value={currentStock}
                            valueStyle={{
                                fontSize: 64,
                                fontWeight: 'bold',
                                color: currentStock <= 10 ? '#ff4d4f' : '#52c41a',
                            }}
                            suffix={<span style={{ fontSize: 28, color: '#8c8c8c' }}> cái</span>}
                        />
                    </div>

                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        {/* Ẩn warehouseId */}
                        <Form.Item name="warehouseId" initialValue={WAREHOUSE_ID} noStyle />

                        <Form.Item
                            name="action"
                            label={<span style={{ fontSize: 16, fontWeight: 500 }}>Hành động</span>}
                            rules={[{ required: true }]}
                        >
                            <Select size="large" style={{ fontSize: 16 }}>
                                <Option value="IN">
                                    <Tag color="green">Nhập kho</Tag>
                                </Option>
                                <Option value="OUT">
                                    <Tag color="red">Xuất kho</Tag>
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="quantity"
                            label={<span style={{ fontSize: 16, fontWeight: 500 }}>Số lượng</span>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lượng!' },
                                { type: 'number', min: 1, message: 'Số lượng phải ≥ 1' },
                            ]}
                        >
                            <InputNumber
                                min={1}
                                size="large"
                                style={{ width: '100%', fontSize: 18 }}
                                placeholder="Nhập số lượng"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updating}
                                block
                                size="large"
                                style={{
                                    height: 56,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    borderRadius: 12,
                                }}
                            >
                                {updating ? 'Đang xử lý...' : 'Thực hiện ngay'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default InventoryUpdatePage;