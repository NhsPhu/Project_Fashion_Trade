import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const OrderSuccessPage = () => {
    const location = useLocation();
    // SỬA LỖI: Dùng optional chaining (?.) để truy cập an toàn
    const order = location.state?.order;
    const orderNumber = order?.orderNo;

    return (
        <Result
            status="success"
            title="Đặt hàng thành công!"
            subTitle={
                orderNumber
                ? `Mã đơn hàng của bạn là: ${orderNumber}. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.`
                : 'Cảm ơn bạn đã mua sắm. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.'
            }
            extra={[
                <Link to="/products" key="buy">
                    <Button type="primary">Tiếp tục mua sắm</Button>
                </Link>,
                // Dùng optional chaining để tạo link an toàn
                <Link to={`/user/orders/${order?.id}`} key="order">
                    <Button>Xem chi tiết đơn hàng</Button>
                </Link>,
            ]}
        />
    );
};

export default OrderSuccessPage;
