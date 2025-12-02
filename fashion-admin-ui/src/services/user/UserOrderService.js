import { userApiClient } from './httpClient';

const UserOrderService = {
  checkout: async (sessionId, checkoutData) => {
    // SỬA LỖI: Bỏ phần /api/v1/ bị lặp
    const url = '/user/orders/checkout'; 

    const params = sessionId ? { sessionId } : {};

    const response = await userApiClient.post(url, checkoutData, { params });

    return response.data;
  },

};

export default UserOrderService;
