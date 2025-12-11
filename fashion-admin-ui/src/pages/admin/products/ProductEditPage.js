import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    Col,
    Spin
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

function ProductEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useEffect để Tải và Điền (Fill) dữ liệu
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, catData, brandData] = await Promise.all([
                    ProductService.getProductById(id),
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);

                setCategories(catData);
                setBrands(brandData);

                // Đây là phần "Fill thông tin"
                form.setFieldsValue({
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    status: productData.status,
                    defaultImage: productData.defaultImage,
                    categoryId: productData.categoryId,
                    brandId: productData.brandId,
                    seoMetaTitle: productData.seoMetaTitle,
                    seoMetaDesc: productData.seoMetaDesc,
                    variants: productData.variants,
                    images: productData.images
                });

                setLoading(false);
            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
                setLoading(false);
            }
        };
        loadData();
    }, [id, form]);

    // Hàm Submit (Cập nhật)
    const onFinish = async (values) => {
        setIsSubmitting(true);
        try {
            const productData = {
                ...values,
                variants: values.variants || [],
                images: values.images || []
            };
            await ProductService.updateProduct(id, productData);
            notification.success({ message: 'Cập nhật thành công!' });
            navigate('/admin/products');
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Spin tip="Đang tải dữ liệu sản phẩm..." size="large" fullscreen />;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            {/* Đã xóa nút "Tạo bản sao" khỏi đây */}
            <Title level={2}>Chỉnh sửa Sản phẩm (ID: {id})</Title>

            <Form
                {...formLayout}
                form={form}
                name="edit_product"
                onFinish={onFinish}
            >
                {/* (Nội dung Form y hệt như ProductCreatePage) */}
                <Row gutter={24}>
                    <Col span={16}>
                        {/* ... (Các Form.Item cho name, description) ... */}
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={4} />
                        </Form.Item>

                        {/* Variants */}
                        <Form.Item label="Biến thể sản phẩm (Variants)">
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex' }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'sku']} rules={[{ required: true }]}>
                                                    <Input placeholder="SKU" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'attributes']}>
                                                    <Input placeholder='{"size":"M"}' />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                                                    <InputNumber placeholder="Giá" min={0} style={{width: '100%'}} />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'stockQuantity']} rules={[{ required: true }]}>
                                                    <InputNumber placeholder="Tồn kho" min={0} style={{width: '100%'}} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm biến thể
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form.Item>

                        {/* Images */}
                        <Form.Item label="Hình ảnh sản phẩm">
                            <Form.List name="images">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex' }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true }]}>
                                                    <Input placeholder="URL Hình ảnh" style={{width: '300px'}} />
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

                    {/* CỘT BÊN PHẢI */}
                    <Col span={8}>
                        {/* ... (Các Form.Item cho status, categoryId, brandId, v.v...) ... */}
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Draft">Bản nháp</Option>
                                <Option value="Published">Công bố</Option>
                                <Option value="Archived">Lưu trữ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                            <Select placeholder="-- Chọn Danh mục --">
                                {categories.map(cat => (
                                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
                            <Select placeholder="-- Chọn Thương hiệu --">
                                {brands.map(brand => (
                                    <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {/* ... (Các Form.Item khác) ... */}
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} style={{marginTop: '20px'}}>
                        Lưu Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ProductEditPage;