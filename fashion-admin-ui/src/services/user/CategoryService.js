// src/services/user/CategoryService.js
import { userApiClient } from '../httpClient';

const CategoryService = {
    getAll: async () => {
        const response = await userApiClient.get('/public/categories');
        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await userApiClient.get(`/public/categories/${slug}`);
        return response.data;
    },
};

export default CategoryService;