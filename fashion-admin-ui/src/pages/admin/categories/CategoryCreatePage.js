import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/admin/CategoryService';
import {
    Form,
    Button,
    Input,
    Select,
    Switch,
    Typography,
    notification,
    Card
} from 'antd';

const { Title } = Typography;
const { Option } = Select;

function CategoryCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await CategoryService.getAllCategories();
                setAllCategories(data);
            } catch (err) {
                console.error("Lỗi khi tải danh mục cha:", err);
            }
        };
        loadCategories();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // AntD 'switch' trả về true/false, khớp với 'active'
            const categoryData = {
                ...values,
                parentId: values.parentId || null,
            };

            await CategoryService.createCategory(categoryData);
            notification.success({ message: 'Tạo danh mục thành công!' });
            navigate('/admin/categories');

        } catch (err) {
            notification.error({ message: 'Tạo thất bại', description: err.message });
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 600, margin: 'auto' }}>
            <Title level={3}>Tạo Danh mục mới</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ active: true }}
            >
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu Danh mục
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default CategoryCreatePage;