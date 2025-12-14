import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Upload,
    Modal
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };

// Hàm chuyển file sang Base64 để xem trước (Preview)
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ProductCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // State cho Modal xem trước ảnh
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [catData, brandData] = await Promise.all([
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);
                setCategories(catData || []);
                setBrands(brandData || []);
            } catch (err) {
                notification.error({
                    message: 'Lỗi tải dữ liệu',
                    description: 'Không thể tải danh mục hoặc thương hiệu.',
                });
            }
        };
        loadDropdownData();
    }, []);

    // Xử lý Custom Upload (Gửi file lên API ngay khi chọn)
    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await ProductService.uploadImage(formData);
            const imageUrl = response.url; // URL trả về từ Backend

            // Báo cho Ant Design biết là upload thành công và gắn URL vào file
            onSuccess({ url: imageUrl }, file);
            notification.success({ message: 'Đã tải ảnh lên xong!' });
        } catch (err) {
            onError(err);
            notification.error({ message: 'Lỗi upload ảnh', description: err.message });
        }
    };

    // Xử lý xem trước ảnh
    const handleCancelPreview = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // 1. Lọc danh sách ảnh đã upload thành công
            const processedImages = (values.images || []).map((file, index) => {
                if (file.response && file.response.url) {
                    return {
                        url: file.response.url,
                        altText: file.name,
                        order: index
                    };
                }
                return null;
            }).filter(Boolean);

            // 2. LOGIC QUAN TRỌNG: Tự động set defaultImage
            // Nếu người dùng không chọn ảnh đại diện riêng, lấy ảnh đầu tiên trong list làm mặc định
            const defaultImg = processedImages.length > 0 ? processedImages[0].url : null;

            const productData = {
                ...values,
                variants: values.variants || [],
                images: processedImages,
                defaultImage: defaultImg // <--- THÊM DÒNG NÀY ĐỂ LƯU ẢNH RA NGOÀI
            };

            await ProductService.createProduct(productData);
            notification.success({ message: 'Thành công', description: 'Tạo sản phẩm mới thành công!' });
            navigate('/admin/products');
        } catch (err) {
            notification.error({ message: 'Tạo thất bại', description: err.message || 'Lỗi không xác định.' });
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <Title level={2}>Tạo Sản phẩm mới</Title>

            <Form
                {...formLayout}
                form={form}
                name="create_product"
                onFinish={onFinish}
                initialValues={{
                    status: 'Draft',
                    variants: [{ sku: '', price: 0, stockQuantity: 10 }],
                    images: [] // Mảng chứa file ảnh
                }}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                            <Input placeholder="Nhập tên sản phẩm" />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={4} placeholder="Mô tả chi tiết sản phẩm" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn danh mục">
                                        {categories.map(cat => (
                                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn thương hiệu">
                                        {brands.map(brand => (
                                            <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* --- PHẦN UPLOAD ẢNH --- */}
                        <Form.Item
                            label="Hình ảnh sản phẩm"
                            name="images"
                            getValueFromEvent={(e) => {
                                // Chuẩn hóa event từ Upload để Form nhận được fileList
                                if (Array.isArray(e)) return e;
                                return e?.fileList;
                            }}
                        >
                            <Upload
                                listType="picture-card"
                                customRequest={handleUpload} // Dùng hàm upload riêng
                                onPreview={handlePreview}
                                accept="image/*"
                                multiple
                            >
                                {uploadButton}
                            </Upload>
                        </Form.Item>
                        {/* ----------------------- */}

                        <Form.Item label="Biến thể (Size/Màu)">
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'sku']} rules={[{ required: true, message: 'Thiếu SKU' }]}>
                                                    <Input placeholder="SKU (VD: AO-TRANG-M)" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                                                    <InputNumber placeholder="Giá bán" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: 120 }} />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'stockQuantity']} rules={[{ required: true }]}>
                                                    <InputNumber placeholder="SL Tồn" style={{ width: 100 }} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} style={{color: 'red'}} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm biến thể
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select>
                                <Option value="Draft">Bản nháp</Option>
                                <Option value="Published">Công bố</Option>
                                <Option value="Archived">Lưu trữ</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="seoMetaTitle" label="SEO Title">
                            <Input placeholder="Tiêu đề SEO" />
                        </Form.Item>
                        <Form.Item name="seoMetaDesc" label="SEO Description">
                            <TextArea rows={2} placeholder="Mô tả SEO" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                        TẠO SẢN PHẨM
                    </Button>
                </Form.Item>
            </Form>

            {/* Modal xem trước ảnh */}
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}

export default ProductCreatePage;