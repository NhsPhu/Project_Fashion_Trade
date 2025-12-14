import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd';

// --- SỬA LỖI 1: Import apiClient từ AuthService (Thay vì ApiService cũ) ---
// (Lưu ý đường dẫn ../ tùy thuộc vào cấu trúc thư mục của bạn)
import { apiClient } from '../../../services/AuthService';

function ReviewManagementPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // --- SỬA LỖI 2: Dùng apiClient.get (Tự động gắn Token) ---
            const response = await apiClient.get('/admin/reviews');

            const data = response?.data;
            // Backend có thể trả về List hoặc Page, xử lý an toàn:
            const reviewList = Array.isArray(data)
                ? data
                : (data?.content || data?.data || []);

            setReviews(reviewList);
        } catch (error) {
            console.error('Lỗi tải đánh giá:', error);
            // Không hiển thị lỗi nếu chỉ là danh sách trống
            if (error.response?.status !== 404) {
                message.error('Không thể tải danh sách đánh giá');
            }
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (values) => {
        try {
            // --- SỬA LỖI 3: Dùng apiClient.post ---
            await apiClient.post(`/admin/reviews/${selectedReview.id}/reply`, values);
            message.success('Trả lời thành công');
            setModalOpen(false);
            form.resetFields();
            await fetchReviews();
        } catch (error) {
            console.error('Lỗi trả lời:', error);
            message.error('Gửi trả lời thất bại');
        }
    };

    // ... (Phần columns và render giữ nguyên như cũ) ...
    const columns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'product' },
        { title: 'Khách hàng', dataIndex: 'userName', key: 'user' }, // Sửa dataIndex cho khớp backend
        { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', render: r => <Tag color="gold">{r} sao</Tag> },
        { title: 'Bình luận', dataIndex: 'content', key: 'comment' }, // Sửa comment -> content (tùy Entity)
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => record.reply ? <Tag color="green">Đã trả lời</Tag> : <Tag color="red">Chưa trả lời</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    size="small"
                    type="primary"
                    disabled={!!record.reply} // Disable nếu đã trả lời
                    onClick={() => {
                        setSelectedReview(record);
                        setModalOpen(true);
                    }}
                >
                    Trả lời
                </Button>
            )
        },
    ];

    return (
        <>
            <Table
                title={() => <h3>Quản lý đánh giá</h3>}
                loading={loading}
                dataSource={reviews}
                columns={columns}
                rowKey="id"
                bordered
            />
            {/* ... Modal giữ nguyên ... */}
            <Modal
                title="Trả lời đánh giá"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleReply} layout="vertical">
                    <Form.Item name="reply" label="Nội dung" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ReviewManagementPage;