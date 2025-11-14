// src/pages/coupon/CouponFormPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Select, DatePicker, InputNumber, notification, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CouponService from '../../services/CouponService';
import moment from 'moment';

const { Option } = Select;

const CouponFormPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const loadCoupon = useCallback(async () => {
        setLoading(true);
        try {
            const data = await CouponService.getById(id);
            form.setFieldsValue({
                ...data,
                startDate: moment(data.startDate),
                endDate: moment(data.endDate),
            });
        } catch (error) {
            notification.error({ message: 'Lỗi tải dữ liệu' });
        } finally {
            setLoading(false);
        }
    }, [id, form]);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            loadCoupon();
        }
    }, [id, loadCoupon]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
            };

            if (isEdit) {
                await CouponService.update(id, payload);
                notification.success({ message: 'Cập nhật thành công!' });
            } else {
                await CouponService.create(payload);
                notification.success({ message: 'Tạo mã giảm giá thành công!' });
            }
            navigate('/admin/coupons');
        } catch (error) {
            notification.error({ message: 'Lỗi', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return <Spin tip="Đang tải..." style={{ display: 'block', marginTop: 100 }} />;
    }

    return (
        <Card style={{ maxWidth: 700, margin: '40px auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="code" label="Mã giảm giá" rules={[{ required: true }]}>
                    <Input placeholder="SUMMER2025" />
                </Form.Item>

                <Form.Item name="type" label="Loại giảm giá" rules={[{ required: true }]}>
                    <Select placeholder="Chọn loại">
                        <Option value="PERCENT">Phần trăm (%)</Option>
                        <Option value="FIXED">Số tiền cố định</Option>
                        <Option value="FREE_SHIPPING">Miễn phí vận chuyển</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="value" label="Giá trị giảm" rules={[{ required: true, type: 'number', min: 0 }]}>
                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`} parser={value => value.replace(/\D/g, '')} />
                </Form.Item>

                <Form.Item name="minOrderValue" label="Tổng đơn tối thiểu (để áp dụng)">
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item name="usageLimit" label="Giới hạn lượt dùng" rules={[{ required: true, type: 'number', min: 1 }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {isEdit ? 'Cập nhật' : 'Tạo mã'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CouponFormPage;