import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/admin/inventory';

const getHeaders = () => ({});

export default {
    getLowStock: async () => {
        const response = await axios.get(`${API_URL}/low-stock`, { headers: getHeaders() });
        return response.data;
    },
    getStock: async (variantId) => {
        const response = await axios.get(`${API_URL}/${variantId}`, { headers: getHeaders() });
        return response.data;
    },
    updateStock: async ({ variantId, quantity }) => {
        await axios.put(`${API_URL}/${variantId}`, { quantity }, { headers: getHeaders() });
    },
};