// src/pages/config/SystemConfigPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Tabs, Switch, message, Table, Tag } from 'antd';
import ApiService from '../../../services/ApiService';

const { TabPane } = Tabs;

function SystemConfigPage() {
    const [shippingForm] = Form.useForm();
    const [paymentForm] = Form.useForm();
    const [smtpForm] = Form.useForm();
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllConfigs = useCallback(async () => {
        try {
            const [shipping, payment, smtp] = await Promise.all([
                ApiService.get('/admin/config/shipping'),
                ApiService.get('/admin/config/payment'),
                ApiService.get('/admin/config/smtp')
            ]);
            shippingForm.setFieldsValue(shipping);
            paymentForm.setFieldsValue(payment);
            smtpForm.setFieldsValue(smtp);
        } catch (error) {
            message.error('Lỗi tải cấu hình');
        }
    }, [shippingForm, paymentForm, smtpForm]);

    const fetchAuditLogs = useCallback(async () => {
        setLoading(true);
        try {
            const logs = await ApiService.get('/admin/audit/logs?page=0&size=10');
            setAuditLogs(logs.content || logs);
        } catch (error) {
            message.error('Lỗi tải logs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllConfigs();
        fetchAuditLogs();
    }, [fetchAllConfigs, fetchAuditLogs]);

    const handleSave = async (form, endpoint, successMsg) => {
        try {
            const values = await form.validateFields();
            await ApiService.put(endpoint, values);
            message.success(successMsg);
        } catch (error) {
            message.error('Lỗi lưu cấu hình');
        }
    };

    const columns = [
        { title: 'Người dùng', dataIndex: ['user', 'email'], key: 'user' },
        { title: 'Hành động', dataIndex: 'action', key: 'action' },
        { title: 'Thời gian', dataIndex: 'createdAt', key: 'time', render: text => new Date(text).toLocaleString() },
        { title: 'IP', dataIndex: 'ipAddress', key: 'ip' },
        {
            title: 'Trạng thái',
            dataIndex: 'success',
            key: 'status',
            render: success => (
                <Tag color={success ? 'green' : 'red'}>{success ? 'Thành công' : 'Thất bại'}</Tag>
            )
        },
    ];

    return (
        <Tabs defaultActiveKey="shipping">
            <TabPane tab="Vận chuyển" key="shipping">
                <Form form={shippingForm} layout="vertical">
                    <Form.Item name="defaultFee" label="Phí mặc định (VNĐ)">
                        <Input type="number" suffix="VNĐ" />
                    </Form.Item>
                    <Form.Item name="freeThreshold" label="Miễn phí từ (VNĐ)">
                        <Input type="number" suffix="VNĐ" />
                    </Form.Item>
                    <Form.Item name="enabled" label="Kích hoạt" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Button type="primary" onClick={() => handleSave(shippingForm, '/admin/config/shipping', 'Lưu vận chuyển thành công')}>
                        Lưu
                    </Button>
                </Form>
            </TabPane>

            <TabPane tab="Thanh toán" key="payment">
                <Form form={paymentForm} layout="vertical">
                    <Form.Item name="gateway" label="Cổng thanh toán">
                        <Input placeholder="Ví dụ: VNPay, Momo" />
                    </Form.Item>
                    <Form.Item name="apiKey" label="API Key">
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" onClick={() => handleSave(paymentForm, '/admin/config/payment', 'Lưu thanh toán thành công')}>
                        Lưu
                    </Button>
                </Form>
            </TabPane>

            <TabPane tab="SMTP Email" key="smtp">
                <Form form={smtpForm} layout="vertical">
                    <Form.Item name="host" label="SMTP Host">
                        <Input placeholder="smtp.gmail.com" />
                    </Form.Item>
                    <Form.Item name="port" label="Port">
                        <Input type="number" placeholder="587" />
                    </Form.Item>
                    <Form.Item name="username" label="Username">
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" onClick={() => handleSave(smtpForm, '/admin/config/smtp', 'Lưu SMTP thành công')}>
                        Lưu
                    </Button>
                </Form>
            </TabPane>

            <TabPane tab="Lịch sử hoạt động" key="logs">
                <Table loading={loading} dataSource={auditLogs} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
            </TabPane>
        </Tabs>
    );
}

export default SystemConfigPage;