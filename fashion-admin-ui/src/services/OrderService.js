import { userApiClient } from './user/httpClient';

const OrderService = {
    checkout: async (orderData) => {
        const response = await userApiClient.post('/user/orders/checkout', orderData);
        return response.data;
    },

    // PHƯƠNG THỨC MỚI
    getMyOrders: async () => {
        const response = await userApiClient.get('/user/orders');
        return response.data;
    },

    // PHƯƠNG THỨC MỚI
    getOrderDetail: async (orderId) => {
        const response = await userApiClient.get(`/user/orders/${orderId}`);
        return response.data;
    }
};

export default OrderService;
