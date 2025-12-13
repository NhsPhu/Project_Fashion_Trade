import { userApiClient } from './httpClient';

const OrderService = {
  getOrderDetail: async (orderId) => {
    const response = await userApiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  createOrder: async (payload) => {
    const response = await userApiClient.post('/orders/checkout', payload);
    return response.data;
  },
};

export default OrderService;
