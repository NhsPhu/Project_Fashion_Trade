// src/pages/coupon/CouponFormPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Select,
    DatePicker,
    InputNumber,
    notification,
    Spin,
    Typography,
    Space,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CouponService from '../../../services/admin/CouponService';
import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;

const CouponFormPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // Theo dõi loại để render input phù hợp
    const type = Form.useWatch('type', form);

    const loadCoupon = useCallback(async () => {
        setLoading(true);
        try {
            const data = await CouponService.getById(id);
            form.setFieldsValue({
                ...data,
                startDate: data.startDate ? moment(data.startDate) : null,
                endDate: data.endDate ? moment(data.endDate) : null,
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: error.message || 'Không thể tải thông tin mã giảm giá',
            });
        } finally {
            setLoading(false);
        }
    }, [id, form]);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            loadCoupon();
        } else {
            // Mặc định khi tạo mới
            form.setFieldsValue({ type: 'PERCENT' });
        }
    }, [id, loadCoupon, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                startDate: values.startDate?.toISOString() || null,
                endDate: values.endDate?.toISOString() || null,
                value: values.value !== undefined ? Number(values.value) : null,
                minOrderValue: values.minOrderValue !== undefined ? Number(values.minOrderValue) : null,
            };

            if (isEdit) {
                await CouponService.update(id, payload);
                notification.success({ message: 'Cập nhật mã giảm giá thành công!' });
            } else {
                await CouponService.create(payload);
                notification.success({ message: 'Tạo mã giảm giá thành công!' });
            }
            navigate('/admin/coupons');
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error.response?.data?.message || error.message || 'Đã có lỗi xảy ra',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/coupons');
    };

    if (loading && isEdit) {
        return <Spin tip="Đang tải..." style={{ display: 'block', marginTop: 100 }} />;
    }

    return (
        <Card style={{ maxWidth: 700, margin: '40px auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
                {isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
            </h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Mã giảm giá */}
                <Form.Item
                    name="code"
                    label="Mã giảm giá"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã!' },
                        { pattern: /^[A-Z0-9]+$/, message: 'Chỉ chấp nhận chữ cái in hoa và số!' },
                    ]}
                >
                    <Input
                        placeholder="THANKS2025"
                        style={{ textTransform: 'uppercase' }}
                        onChange={(e) => form.setFieldsValue({ code: e.target.value.toUpperCase() })}
                    />
                </Form.Item>

                {/* Loại giảm giá */}
                <Form.Item name="type" label="Loại giảm giá" rules={[{ required: true }]}>
                    <Select
                        placeholder="Chọn loại giảm giá"
                        onChange={() => {
                            form.setFieldsValue({ value: undefined });
                        }}
                    >
                        <Option value="PERCENT">Giảm theo phần trăm (%)</Option>
                        <Option value="FIXED">Giảm số tiền cố định (₫)</Option>
                        <Option value="FREE_SHIPPING">Miễn phí vận chuyển</Option>
                    </Select>
                </Form.Item>

                {/* Giá trị giảm - Tự động thay đổi theo loại */}
                <Form.Item
                    label={
                        <span>
                            Giá trị giảm{' '}
                            {type === 'PERCENT' && <Text type="danger">(từ 1% - 100%)</Text>}
                            {type === 'FIXED' && <Text type="success">(đơn vị: VNĐ)</Text>}
                            {type === 'FREE_SHIPPING' && <Text type="secondary">(không cần nhập)</Text>}
                        </span>
                    }
                    name="value"
                    rules={[
                        {
                            required: type !== 'FREE_SHIPPING',
                            message: 'Vui lòng nhập giá trị giảm!',
                        },
                        () => ({
                            validator(_, value) {
                                if (type === 'PERCENT' && (value < 1 || value > 100)) {
                                    return Promise.reject(new Error('Phần trăm phải từ 1 đến 100!'));
                                }
                                if (type === 'FIXED' && value <= 0) {
                                    return Promise.reject(new Error('Số tiền phải lớn hơn 0!'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    {type === 'PERCENT' ? (
                        <InputNumber
                            min={1}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => value.replace('%', '')}
                            style={{ width: '100%' }}
                            placeholder="Ví dụ: 20"
                        />
                    ) : type === 'FREE_SHIPPING' ? (
                        <Input disabled value="Miễn phí vận chuyển" />
                    ) : (
                        <InputNumber
                            min={1}
                            formatter={(value) =>
                                value ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(value) => value.replace(/[₫\s,]/g, '')}
                            style={{ width: '100%' }}
                            placeholder="Ví dụ: 50000"
                        />
                    )}
                </Form.Item>

                {/* Tổng đơn tối thiểu */}
                <Form.Item name="minOrderValue" label="Tổng đơn tối thiểu (để áp dụng mã)">
                    <InputNumber
                        min={0}
                        formatter={(value) =>
                            value ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                        }
                        parser={(value) => value.replace(/[₫\s,]/g, '')}
                        style={{ width: '100%' }}
                        placeholder="0 = Không giới hạn"
                    />
                </Form.Item>

                {/* Ngày bắt đầu */}
                <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                    <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
                </Form.Item>

                {/* Ngày kết thúc */}
                <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                    <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
                </Form.Item>

                {/* Giới hạn lượt dùng */}
                <Form.Item
                    name="usageLimit"
                    label="Giới hạn số lượt sử dụng"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượt!' },
                        { type: 'number', min: 1, message: 'Tối thiểu 1 lượt!' },
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 100" />
                </Form.Item>

                {/* NÚT HÀNH ĐỘNG - CÓ NÚT QUAY LẠI */}
                <Form.Item>
                    <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            size="large"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                        >
                            Quay lại
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                        >
                            {isEdit ? 'Cập nhật mã' : 'Tạo mã mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CouponFormPage;