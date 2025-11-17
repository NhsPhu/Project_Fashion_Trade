// src/pages/admin/cms/CmsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Table, Modal, Switch, message, Space } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import ApiService from '../../../services/ApiService';

function CmsPage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const response = await ApiService.get('/admin/cms/pages');
            const rawData = response?.data ?? response;

            console.log('API Response:', rawData); // Debug: Xem cấu trúc dữ liệu

            let pageList = [];

            // Xử lý nhiều định dạng trả về phổ biến
            if (Array.isArray(rawData)) {
                pageList = rawData;
            } else if (rawData?.pages && Array.isArray(rawData.pages)) {
                pageList = rawData.pages;
            } else if (rawData?.data && Array.isArray(rawData.data)) {
                pageList = rawData.data;
            } else if (rawData?.items && Array.isArray(rawData.items)) {
                pageList = rawData.items;
            } else {
                console.warn('API trả về không phải mảng:', rawData);
                message.warning('Dữ liệu trang không hợp lệ từ server');
            }

            setPages(pageList);
        } catch (error) {
            console.error('Lỗi tải trang:', error.response || error);
            message.error(
                'Không thể tải trang: ' +
                (error.response?.status === 404
                    ? 'API không tồn tại'
                    : error.response?.data?.message || error.message)
            );
            setPages([]); // Luôn đảm bảo là mảng
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        console.log('Bắt đầu lưu trang...');
        try {
            const values = await form.validateFields();
            const content = editorRef.current?.getContent() || '';

            const payload = {
                title: values.title.trim(),
                slug: values.slug.trim(),
                content: content,
                metaTitle: values.metaTitle?.trim() || null,
                metaDescription: values.metaDescription?.trim() || null,
                published: values.published ?? false,
            };

            console.log('Gửi API:', payload);

            if (editingPage) {
                await ApiService.put(`/admin/cms/pages/${editingPage.id}`, payload);
                message.success('Cập nhật trang thành công!');
            } else {
                await ApiService.post('/admin/cms/pages', payload);
                message.success('Tạo trang mới thành công!');
            }

            closeModal();
            fetchPages();
        } catch (error) {
            console.error('Lỗi khi lưu:', error);
            if (error.errorFields) {
                message.error('Vui lòng điền đầy đủ các trường bắt buộc');
            } else {
                const msg = error.response?.data?.message || error.message || 'Lỗi không xác định';
                message.error('Lỗi lưu trang: ' + msg);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await ApiService.delete(`/admin/cms/pages/${id}`);
            message.success('Xóa trang thành công');
            fetchPages();
        } catch (error) {
            console.error('Lỗi xóa:', error);
            const msg = error.response?.data?.message || 'Không thể xóa trang';
            message.error(msg);
        }
    };

    const openEditor = (page = null) => {
        setEditingPage(page);
        form.resetFields();

        const defaultValues = {
            title: page?.title || '',
            slug: page?.slug || '',
            metaTitle: page?.metaTitle || '',
            metaDescription: page?.metaDescription || '',
            published: page?.published ?? false,
        };

        form.setFieldsValue(defaultValues);

        // Xử lý editor
        if (editorRef.current) {
            editorRef.current.setContent(page?.content || '');
        }

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        form.resetFields();
        if (editorRef.current) {
            editorRef.current.setContent('');
        }
        setEditingPage(null);
    };

    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
        { title: 'SEO Title', dataIndex: 'metaTitle', key: 'metaTitle' },
        {
            title: 'Công khai',
            dataIndex: 'published',
            key: 'published',
            render: (published) => <Switch checked={published} disabled />,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => openEditor(record)}>Sửa</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => openEditor()}>
                    Tạo trang mới
                </Button>
            </div>

            <Table
                loading={loading}
                dataSource={Array.isArray(pages) ? pages : []}
                columns={columns}
                rowKey={(record) => record.id || Math.random()}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingPage ? 'Chỉnh sửa trang' : 'Tạo trang mới'}
                open={modalOpen}
                onOk={handleSave}
                onCancel={closeModal}
                width={900}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="Nhập tiêu đề trang" />
                    </Form.Item>

                    <Form.Item
                        name="slug"
                        label="Slug"
                        rules={[
                            { required: true, message: 'Vui lòng nhập slug' },
                            { pattern: /^[a-z0-9-]+$/, message: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang' },
                        ]}
                    >
                        <Input placeholder="gioi-thieu-cong-ty" />
                    </Form.Item>

                    <Form.Item label="Nội dung">
                        <Editor
                            onInit={(evt, editor) => (editorRef.current = editor)}
                            apiKey="jj3q1jbu0buc788s11llnj1jrt2ks3f61is7ibarmje5flgc"
                            initialValue=""
                            init={{
                                height: 400,
                                menubar: true,
                                plugins: 'lists link image table code',
                                toolbar:
                                    'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image table | code',
                                branding: false,
                                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; }',
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="metaTitle" label="Meta Title (SEO)">
                        <Input placeholder="Tối đa 60 ký tự" maxLength={60} showCount />
                    </Form.Item>

                    <Form.Item name="metaDescription" label="Meta Description (SEO)">
                        <Input.TextArea
                            rows={3}
                            placeholder="Tối đa 160 ký tự"
                            maxLength={160}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item name="published" label="Công khai trang" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default CmsPage;