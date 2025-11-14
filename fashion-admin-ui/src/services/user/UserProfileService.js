import { userApiClient } from './httpClient';

const UserProfileService = {
  getProfile: async () => {
    const response = await userApiClient.get('/user/profile');
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await userApiClient.put('/user/profile', payload);
    return response.data;
  },

  getAddresses: async () => {
    const response = await userApiClient.get('/user/profile/addresses');
    return response.data;
  },

  addAddress: async (payload) => {
    const response = await userApiClient.post('/user/profile/addresses', payload);
    return response.data;
  },

  updateAddress: async (addressId, payload) => {
    const response = await userApiClient.put(`/user/profile/addresses/${addressId}`, payload);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    await userApiClient.delete(`/user/profile/addresses/${addressId}`);
  },

  getActivity: async () => {
    const response = await userApiClient.get('/user/profile/activity');
    return response.data;
  },
};

export default UserProfileService;



