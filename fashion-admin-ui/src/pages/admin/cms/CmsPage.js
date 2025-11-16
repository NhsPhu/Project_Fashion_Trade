// src/pages/cms/CmsPage.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Modal, Switch, message, Space } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import ApiService from '../../../services/admin/ApiService';

function CmsPage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const data = await ApiService.get('/admin/cms/pages');
            setPages(data);
        } catch (error) {
            message.error('Lỗi tải trang');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values) => {
        try {
            const payload = {
                ...values,
                content: values.content || ''
            };
            if (editingPage) {
                await ApiService.put(`/admin/cms/pages/${editingPage.id}`, payload);
                message.success('Cập nhật thành công');
            } else {
                await ApiService.post('/admin/cms/pages', payload);
                message.success('Tạo trang thành công');
            }
            setModalOpen(false);
            form.resetFields();
            fetchPages();
        } catch (error) {
            message.error('Lỗi lưu trang');
        }
    };

    const handleDelete = async (id) => {
        try {
            await ApiService.delete(`/admin/cms/pages/${id}`);
            message.success('Xóa thành công');
            fetchPages();
        } catch (error) {
            message.error('Lỗi xóa');
        }
    };

    const openEditor = (page = null) => {
        setEditingPage(page);
        form.setFieldsValue(page || { published: true });
        setModalOpen(true);
    };

    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
        { title: 'SEO Title', dataIndex: 'metaTitle', key: 'metaTitle' },
        { title: 'Public', dataIndex: 'published', key: 'published', render: p => <Switch checked={p} disabled /> },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => openEditor(record)}>Chỉnh sửa</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => openEditor()}>Tạo trang mới</Button>
            </div>

            <Table loading={loading} dataSource={pages} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />

            <Modal
                title={editingPage ? 'Chỉnh sửa trang' : 'Tạo trang mới'}
                open={modalOpen}
                onOk={() => form.submit()}
                onCancel={() => {
                    setModalOpen(false);
                    form.resetFields();
                }}
                width={800}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
                        <Input placeholder="gioi-thieu" />
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung">
                        <Editor
                            apiKey="your-tinymce-key-here" // Thay bằng key thật
                            init={{
                                height: 400,
                                menubar: true,
                                plugins: 'lists link image table code',
                                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code'
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="metaTitle" label="Meta Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name="metaDescription" label="Meta Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="published" label="Public" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default CmsPage;