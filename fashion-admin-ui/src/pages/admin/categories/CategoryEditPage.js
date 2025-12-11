import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../../services/admin/CategoryService';
import {
    Form,
    Button,
    Input,
    Select,
    Switch,
    Typography,
    notification,
    Card,
    Spin
} from 'antd';

const { Title } = Typography;
const { Option } = Select;

function CategoryEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // useEffect (Tải và Fill dữ liệu) - Giữ nguyên
    useEffect(() => {
        const loadData = async () => {
            try {
                const [catData, allCatsData] = await Promise.all([
                    CategoryService.getCategoryById(id),
                    CategoryService.getAllCategories()
                ]);

                form.setFieldsValue({
                    name: catData.name,
                    slug: catData.slug,
                    description: catData.description,
                    parentId: catData.parentId,
                    active: catData.active
                });

                setAllCategories(allCatsData.filter(cat => cat.id.toString() !== id.toString()));

            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, form]);

    // onFinish (Cập nhật) - Giữ nguyên
    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            const categoryData = { ...values, parentId: values.parentId || null };
            await CategoryService.updateCategory(id, categoryData);
            notification.success({ message: 'Cập nhật thành công!' });
            navigate('/admin/categories');
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <Spin tip="Đang tải dữ liệu..." size="large" fullscreen />;
    }

    return (
        <Card style={{ maxWidth: 600, margin: 'auto' }}>
            {/* Đã xóa nút "Tạo bản sao" khỏi đây */}
            <Title level={3}>Chỉnh sửa Danh mục (ID: {id})</Title>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* ... (Toàn bộ nội dung Form.Item giữ nguyên) ... */}
                <Form.Item name="name" label="Tên Danh mục" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="parentId" label="Danh mục cha">
                    <Select placeholder="-- Không có --" allowClear>
                        {allCategories.map(cat => (
                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating}>
                        Lưu Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default CategoryEditPage;