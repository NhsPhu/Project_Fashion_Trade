import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Spin } from 'antd';

const CheckoutForm = ({ clientSecret, order, onPaymentSuccess, onPaymentError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: order.shippingName, // Lấy tên từ thông tin đơn hàng
                },
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            onPaymentError(stripeError.message); // Thông báo lỗi cho component cha
            setProcessing(false);
        } else {
            console.log('Thanh toán thành công:', paymentIntent);
            onPaymentSuccess(order); // Thông báo thành công cho component cha
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4 style={{ marginBottom: '20px' }}>Nhập thông tin thẻ của bạn</h4>
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <Button
                type="primary"
                htmlType="submit"
                disabled={!stripe || processing}
                style={{ marginTop: '20px', width: '100%' }}
            >
                {processing ? <Spin /> : `Thanh toán ${order.totalAmount.toLocaleString('vi-VN')} ₫`}
            </Button>
        </form>
    );
};

export default CheckoutForm;
