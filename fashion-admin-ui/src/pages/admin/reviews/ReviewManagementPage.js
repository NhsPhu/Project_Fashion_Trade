// src/pages/reviews/ReviewManagementPage.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd';
import ApiService from '../../../services/ApiService';

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
            const response = await ApiService.get('/admin/reviews');
            // XỬ LÝ AN TOÀN: luôn lấy được mảng
            const data = response?.data;
            const reviewList = Array.isArray(data)
                ? data
                : data?.reviews || data?.items || data?.data || [];

            setReviews(reviewList);
        } catch (error) {
            console.error('Lỗi tải đánh giá:', error);
            message.error('Lỗi tải đánh giá');
            setReviews([]); // Đảm bảo không crash
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (values) => {
        try {
            await ApiService.post(`/admin/reviews/${selectedReview.id}/reply`, values);
            message.success('Trả lời thành công');
            setModalOpen(false);
            form.resetFields();
            await fetchReviews();
        } catch (error) {
            console.error('Lỗi trả lời:', error);
            message.error('Lỗi trả lời');
        }
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'product' },
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customer' },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: r => `${r} sao`
        },
        { title: 'Bình luận', dataIndex: 'comment', key: 'comment' },
        {
            title: 'Trả lời',
            dataIndex: 'reply',
            key: 'reply',
            render: r => r ? <Tag color="green">Đã trả lời</Tag> : <Tag color="gray">Chưa trả lời</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                        setSelectedReview(record);
                        form.setFieldsValue({ reply: record.reply || '' });
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
                title={() => <strong style={{ fontSize: '18px' }}>Quản lý đánh giá khách hàng</strong>}
                loading={loading}
                dataSource={reviews}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'Chưa có đánh giá nào' }}
            />

            <Modal
                title={`Trả lời đánh giá - ${selectedReview?.productName || ''}`}
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    form.resetFields();
                    setSelectedReview(null);
                }}
                onOk={() => form.submit()}
                okText="Gửi trả lời"
                cancelText="Hủy"
            >
                <Form form={form} onFinish={handleReply} layout="vertical">
                    <Form.Item
                        name="reply"
                        label="Nội dung trả lời"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung trả lời' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Cảm ơn bạn đã đánh giá sản phẩm của chúng tôi..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ReviewManagementPage;