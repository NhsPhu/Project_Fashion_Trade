import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import {
    Form,
    Button,
    Checkbox,
    Spin,
    Typography,
    notification,
    Input,
    Card
} from 'antd';

const { Title } = Typography;

// Danh sách tất cả vai trò (lấy từ Enum Role.java)
const ALL_ROLES = [
    "CUSTOMER",
    "PRODUCT_MANAGER",
    "ORDER_MANAGER",
    "SUPPORT",
    "MARKETING",
    "SUPER_ADMIN"
];

function UserEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await UserService.getUserById(id);
                // Điền dữ liệu vào form
                form.setFieldsValue({
                    email: userData.email,
                    fullName: userData.fullName,
                    roles: userData.roles // Checkbox.Group sẽ tự động chọn
                });
            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, form]);

    // Hàm xử lý Submit
    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            await UserService.updateUserRoles(id, values.roles);
            notification.success({ message: 'Cập nhật vai trò thành công!' });
            navigate('/admin/users');
        } catch (err) {
            notification.error({ message: 'Cập nhật thất bại', description: err.message });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <Spin tip="Đang tải thông tin người dùng..." size="large" fullscreen />;
    }

    return (
        <Card style={{ maxWidth: 600, margin: 'auto' }}>
            <Title level={3}>Chỉnh sửa Người dùng (ID: {id})</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="email" label="Email:">
                    <Input readOnly disabled />
                </Form.Item>
                <Form.Item name="fullName" label="Họ tên:">
                    <Input readOnly disabled />
                </Form.Item>

                {/* Phần Cập nhật Vai trò */}
                <Form.Item
                    name="roles"
                    label="Vai trò (Roles)"
                    rules={[{ required: true, message: 'Phải chọn ít nhất 1 vai trò' }]}
                >
                    <Checkbox.Group options={ALL_ROLES} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating}>
                        Lưu thay đổi Vai trò
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default UserEditPage;