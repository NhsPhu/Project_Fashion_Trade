// src/pages/admin/users/UserEditPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../../services/admin/UserService';
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

// Danh sách quyền cho Admin chọn (Đã ẩn CUSTOMER)
const SELECTABLE_ROLES = [
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

                // Lọc bỏ CUSTOMER để không bị warning trên giao diện checkbox
                const displayRoles = userData.roles.filter(role => role !== 'CUSTOMER');

                form.setFieldsValue({
                    email: userData.email,
                    fullName: userData.fullName,
                    roles: displayRoles
                });
            } catch (err) {
                notification.error({ message: 'Lỗi tải dữ liệu', description: err.message });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, form]);

    const onFinish = async (values) => {
        setIsUpdating(true);
        try {
            // Tự động thêm quyền CUSTOMER vào danh sách gửi đi
            const finalRoles = [...new Set([...values.roles, "CUSTOMER"])];

            await UserService.updateUserRoles(id, finalRoles);
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

                <Form.Item
                    name="roles"
                    label="Vai trò Quản trị (Roles)"
                    help="Vai trò 'CUSTOMER' sẽ luôn được giữ mặc định."
                >
                    <Checkbox.Group options={SELECTABLE_ROLES} />
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

// QUAN TRỌNG: Dòng này giúp AdminRoutes import được file này
export default UserEditPage;