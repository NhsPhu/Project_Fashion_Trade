import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// (Đường dẫn import của bạn)
import ProductService from '../../../services/admin/ProductService';
import CategoryService from '../../../services/admin/CategoryService';
import BrandService from '../../../services/admin/BrandService';
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
const { Option } = Select; // <-- 1. BỔ SUNG THÊM IMPORT
const { TextArea } = Input;

const formLayout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };

function ProductCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 2. ========== THÊM STATE ĐỂ LƯU DANH MỤC/THƯƠNG HIỆU ==========
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    // ==========================================================

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                // 3. ========== SỬA LOGIC TẢI DỮ LIỆU ==========
                // Tải đồng thời và LƯU KẾT QUẢ vào state
                const [catData, brandData] = await Promise.all([
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);
                setCategories(catData || []); // Gán vào state
                setBrands(brandData || []); // Gán vào state
                // ===============================================
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
            {/* (Sửa: Thêm giá trị mặc định cho variants/images) */}
            <Form {...formLayout} form={form} name="create_product" onFinish={onFinish} initialValues={{
                status: 'Draft',
                variants: [{ sku: '', price: 0, stockQuantity: 10 }], // (Sửa 'stock' thành 'stockQuantity')
                images: [{ url: '', altText: '' }]
            }}>
                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={4} />
                        </Form.Item>

                        {/* 4. ========== SỬA LOGIC HIỂN THỊ DROPDOWN ========== */}
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                            <Select placeholder="Chọn danh mục">
                                {/* Dùng .map() để lặp qua state 'categories' */}
                                {categories.map(cat => (
                                    <Option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
                            <Select placeholder="Chọn thương hiệu">
                                {/* Dùng .map() để lặp qua state 'brands' */}
                                {brands.map(brand => (
                                    <Option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {/* ================================================== */}

                        {/* (Sửa: Bọc <Form.List> trong <Form.Item> để có label) */}
                        <Form.Item label="Biến thể sản phẩm (Variants)">
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'sku']} rules={[{ required: true }]}>
                                                    <Input placeholder="SKU" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true, type: 'number' }]}>
                                                    <InputNumber placeholder="Giá" style={{ width: 120 }} min={0} />
                                                </Form.Item>
                                                {/* (Sửa 'stock' thành 'stockQuantity' để khớp với Backend) */}
                                                <Form.Item {...restField} name={[name, 'stockQuantity']} rules={[{ required: true, type: 'number' }]}>
                                                    <InputNumber placeholder="Tồn kho" style={{ width: 100 }} min={0} />
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
                        </Form.Item>

                        {/* (Sửa: Bọc <Form.List> trong <Form.Item> để có label) */}
                        <Form.Item label="Hình ảnh sản phẩm">
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
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Draft">Bản nháp</Option>
                                <Option value="Published">Công bố</Option>
                                <Option value="Archived">Lưu trữ</Option>
                            </Select>
                        </Form.Item>
                        {/* (Bạn có thể thêm defaultImage, SEO... vào đây) */}
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