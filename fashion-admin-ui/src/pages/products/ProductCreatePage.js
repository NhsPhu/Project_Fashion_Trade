// src/pages/products/ProductCreatePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import BrandService from '../../services/BrandService';
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Space,
    Typography,
    notification,
    Row,
    Col
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };

function ProductCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                await Promise.all([
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);
            } catch (err) {
                notification.error({
                    message: 'Lỗi tải dữ liệu',
                    description: 'Không thể tải danh mục hoặc thương hiệu.',
                });
            }
        };
        loadDropdownData();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const productData = {
                ...values,
                variants: values.variants || [],
                images: values.images || []
            };
            await ProductService.createProduct(productData);
            notification.success({ message: 'Thành công', description: 'Tạo sản phẩm mới thành công!' });
            navigate('/admin/products');
        } catch (err) {
            notification.error({ message: 'Tạo thất bại', description: err.message || 'Lỗi không xác định.' });
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <Title level={2}>Tạo Sản phẩm mới</Title>
            <Form {...formLayout} form={form} name="create_product" onFinish={onFinish} initialValues={{ status: 'Draft', variants: [{}], images: [{}] }}>
                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                            <Select placeholder="Chọn danh mục">
                                {/* Danh mục sẽ được load động nếu cần */}
                            </Select>
                        </Form.Item>
                        <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
                            <Select placeholder="Chọn thương hiệu">
                                {/* Thương hiệu sẽ được load động nếu cần */}
                            </Select>
                        </Form.Item>

                        <Form.List name="variants">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'sku']} rules={[{ required: true }]}>
                                                <Input placeholder="SKU" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true, type: 'number' }]}>
                                                <InputNumber placeholder="Giá" style={{ width: 120 }} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'stock']} rules={[{ required: true, type: 'number' }]}>
                                                <InputNumber placeholder="Tồn kho" style={{ width: 100 }} />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm biến thể
                                    </Button>
                                </>
                            )}
                        </Form.List>

                        <Form.List name="images">
                            {(fields, { add, remove }) => (
                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16, marginTop: 16 }}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex' }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true }]}>
                                                <Input placeholder="URL Hình ảnh" style={{ width: '300px' }} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'altText']}>
                                                <Input placeholder="Alt Text" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm hình ảnh
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Draft">Bản nháp</Option>
                                <Option value="Published">Công bố</Option>
                                <Option value="Archived">Lưu trữ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: '20px' }}>
                        Tạo sản phẩm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ProductCreatePage;