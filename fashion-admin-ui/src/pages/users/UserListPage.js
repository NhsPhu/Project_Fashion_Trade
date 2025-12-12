import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import UserService from '../../services/UserService';
import { Table, Button, Space, Tag, Typography, Popconfirm, Tooltip } from 'antd'; // Import component AntD
import { EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'; // Import icons

const { Title } = Typography;

// Hàm gán màu cho Vai trò (Tùy chọn)
const getRoleColor = (role) => {
    switch (role) {
        case 'SUPER_ADMIN': return 'red';
        case 'PRODUCT_MANAGER': return 'blue';
        case 'ORDER_MANAGER': return 'orange';
        case 'CUSTOMER': return 'green';
        default: return 'default';
    }
};

function UserListPage() {
    const navigate = useNavigate(); // Hook để điều hướng

    // 1. State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Hàm fetch dữ liệu
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await UserService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. useEffect: Tải dữ liệu khi mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // 4. Hàm xử lý Khóa/Mở
    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'locked' : 'active';
        try {
            await UserService.updateUserStatus(userId, newStatus);
            alert(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} người dùng thành công.`);
            fetchUsers(); // Tải lại dữ liệu
        } catch (err) {
            alert(`Lỗi khi cập nhật trạng thái: ${err.message}`);
        }
    };

    // 5. Định nghĩa các cột (columns) cho Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Vai trò (Roles)',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <span>
                    {roles?.map(role => (
                        <Tag color={getRoleColor(role)} key={role}>
                            {role}
                        </Tag>
                    ))}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => ( // 'record' là dữ liệu của hàng đó
                <Space size="middle">
                    <Tooltip title="Sửa vai trò">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/users/edit/${record.id}`)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title={record.status === 'active' ? "Khóa người dùng?" : "Mở khóa người dùng?"}
                        description={`Bạn có chắc muốn ${record.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản này?`}
                        onConfirm={() => handleToggleStatus(record.id, record.status)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button
                            danger={record.status === 'active'}
                            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 6. Render Giao diện
    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Quản lý Người dùng</Title>

                {error && <p style={{color: 'red'}}>Lỗi: {error}</p>}

                <Table
                    columns={columns}
                    dataSource={users} // Dữ liệu
                    rowKey="id" // Khóa chính
                    pagination={{ pageSize: 10 }} // Cấu hình phân trang (local)
                    loading={loading} // Hiệu ứng tải
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </div>
    );
}

export default UserListPage;