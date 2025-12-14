// src/services/user/CouponService.js
import api from '../ApiService'; // Đường dẫn đúng đến file api chung (không có /admin)

const CouponService = {
    getActiveCoupons: async () => {
        try {
            const response = await api.get('/coupons/active');
            return response.data || [];
        } catch (error) {
            console.error('Lỗi lấy mã giảm giá hoạt động:', error);
            return [];
        }
    },
};

export default CouponService;