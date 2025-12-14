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
    Spin,
    Upload,  // <-- 1. THÊM
    Modal    // <-- 1. THÊM
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

// Hàm hỗ trợ xem trước ảnh (Base64)
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ProductEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State cho Modal Preview ảnh
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // State lưu danh sách file ảnh cho Upload component
    const [fileList, setFileList] = useState([]);

    // 1. Tải dữ liệu ban đầu
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, catData, brandData] = await Promise.all([
                    ProductService.getProductById(id),
                    CategoryService.getAllCategories(),
                    BrandService.getAllBrands()
                ]);

                setCategories(catData || []);
                setBrands(brandData || []);

                // --- XỬ LÝ ẢNH TỪ API ĐỂ HIỂN THỊ TRONG UPLOAD ---
                // API trả về: [{id: 1, url: "http...", altText: "..."}]
                // Upload cần: [{uid: "1", name: "image.png", status: "done", url: "http..."}]
                const initialFileList = (productData.images || []).map((img, index) => ({
                    uid: img.id ? String(img.id) : `-${index}`, // uid phải là string unique
                    name: img.altText || `Image-${index}`,
                    status: 'done',
                    url: img.url,
                    response: { url: img.url } // Giả lập response để logic submit tái sử dụng được
                }));
                setFileList(initialFileList);
                // ------------------------------------------------

                // Fill thông tin vào Form
                form.setFieldsValue({
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    status: productData.status,
                    categoryId: productData.categoryId,
                    brandId: productData.brandId,
                    seoMetaTitle: productData.seoMetaTitle,
                    seoMetaDesc: productData.seoMetaDesc,
                    variants: productData.variants,
                    // images: productData.images // Không set trực tiếp images vào form value kiểu cũ nữa
                });

                setLoading(false);
            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
                setLoading(false);
            }
        };
        loadData();
    }, [id, form]);

    // 2. Xử lý Upload ảnh mới
    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await ProductService.uploadImage(formData);
            const imageUrl = response.url;

            // Báo cho Upload component biết đã xong
            onSuccess({ url: imageUrl }, file);
            notification.success({ message: 'Đã tải ảnh lên xong!' });
        } catch (err) {
            onError(err);
            notification.error({ message: 'Lỗi upload ảnh', description: err.message });
        }
    };

    // 3. Xử lý thay đổi file list (thêm/xóa ảnh)
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    // 4. Xử lý xem trước ảnh
    const handleCancelPreview = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    // 5. Submit Form
    const onFinish = async (values) => {
        setIsSubmitting(true);
        try {
            // --- XỬ LÝ DANH SÁCH ẢNH TỪ FILELIST ---
            // Lọc ra các file hợp lệ (đã có url từ server hoặc upload thành công)
            const processedImages = fileList.map((file, index) => {
                if (file.response && file.response.url) {
                    return {
                        url: file.response.url,
                        altText: file.name,
                        order: index
                    };
                } else if (file.url) { // Trường hợp ảnh cũ có sẵn URL
                    return {
                        url: file.url,
                        altText: file.name,
                        order: index
                    };
                }
                return null;
            }).filter(Boolean);

            // Tự động chọn ảnh đầu tiên làm defaultImage nếu chưa có
            const defaultImg = processedImages.length > 0 ? processedImages[0].url : null;

            const productData = {
                ...values,
                variants: values.variants || [],
                images: processedImages,
                defaultImage: defaultImg
            };

            await ProductService.updateProduct(id, productData);
            notification.success({ message: 'Cập nhật thành công!' });
            navigate('/admin/products');
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
            setIsSubmitting(false);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    if (loading) {
        return <Spin tip="Đang tải dữ liệu sản phẩm..." size="large" fullscreen />;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
            <Title level={2}>Chỉnh sửa Sản phẩm (ID: {id})</Title>

            <Form
                {...formLayout}
                form={form}
                name="edit_product"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={4} />
                        </Form.Item>

                        {/* --- KHU VỰC UPLOAD ẢNH --- */}
                        <Form.Item label="Hình ảnh sản phẩm">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}       // Liên kết với state fileList
                                onPreview={handlePreview} // Xem trước
                                onChange={handleChange}   // Cập nhật list khi thêm/xóa
                                customRequest={handleUpload} // Upload lên server thật
                                accept="image/*"
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                        {/* ------------------------- */}

                        {/* Variants */}
                        <Form.Item label="Biến thể sản phẩm (Variants)">
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex' }} align="baseline">
                                                <Form.Item {...restField} name={[name, 'sku']} rules={[{ required: true, message: 'Nhập SKU' }]}>
                                                    <Input placeholder="SKU" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                                                    <InputNumber
                                                        placeholder="Giá"
                                                        min={0}
                                                        style={{ width: 120 }}
                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'stockQuantity']} rules={[{ required: true }]}>
                                                    <InputNumber placeholder="Tồn kho" min={0} style={{ width: 100 }} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} style={{color: 'red'}} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm biến thể
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

                        <Form.Item name="seoMetaTitle" label="SEO Title">
                            <Input placeholder="Tiêu đề SEO" />
                        </Form.Item>
                        <Form.Item name="seoMetaDesc" label="SEO Description">
                            <TextArea rows={2} placeholder="Mô tả SEO" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} size="large" block style={{marginTop: '20px'}}>
                        Lưu Cập nhật
                    </Button>
                </Form.Item>
            </Form>

            {/* Modal Xem trước ảnh */}
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}

export default ProductEditPage;