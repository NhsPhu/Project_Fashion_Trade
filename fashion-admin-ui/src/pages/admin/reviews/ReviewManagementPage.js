// src/pages/reviews/ReviewManagementPage.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd';
import ApiService from '../../../services/admin/ApiService';

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
            const data = await ApiService.get('/admin/reviews');
            setReviews(data);
        } catch (error) {
            message.error('Lỗi tải đánh giá');
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
            fetchReviews();
        } catch (error) {
            message.error('Lỗi trả lời');
        }
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'product' },
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customer' },
        { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', render: r => `${r} sao` },
        { title: 'Bình luận', dataIndex: 'comment', key: 'comment' },
        { title: 'Trả lời', dataIndex: 'reply', key: 'reply', render: r => r ? <Tag color="green">Đã trả lời</Tag> : <Tag>Chưa trả lời</Tag> },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    size="small"
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
                title={() => <strong>Quản lý đánh giá khách hàng</strong>}
                loading={loading}
                dataSource={reviews}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={`Trả lời đánh giá - ${selectedReview?.productName}`}
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleReply}>
                    <Form.Item name="reply" label="Nội dung trả lời">
                        <Input.TextArea rows={4} placeholder="Cảm ơn bạn đã đánh giá..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ReviewManagementPage;