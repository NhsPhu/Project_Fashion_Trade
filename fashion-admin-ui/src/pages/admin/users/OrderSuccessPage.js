// src/user/pages/OrderSuccessPage.js

import React from 'react';
import { Result, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 48, textAlign: 'center' }}>
            <Result
                status="success"
                title="Đặt hàng thành công!"
                subTitle="Cảm ơn bạn đã mua sắm. Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất."
                extra={[
                    <Button type="primary" size="large" key="home" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>,
                    <Button size="large" key="continue" onClick={() => navigate('/products')}>
                        Tiếp tục mua sắm
                    </Button>,
                ]}
            />
            <div style={{ marginTop: 24 }}>
                <Title level={4} type="secondary">
                    Mã đơn hàng:{' '}
                    <span style={{ color: '#d4380d' }}>
            #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </span>
                </Title>
            </div>
        </div>
    );
};

export default OrderSuccessPage;