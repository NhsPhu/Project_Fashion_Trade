// src/services/user/BrandService.js
import { userApiClient } from './httpClient';

const BrandService = {
    getAll: async () => {
        const response = await userApiClient.get('/public/brands');
        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await userApiClient.get(`/public/brands/${slug}`);
        return response.data;
    },
};

export default BrandService;