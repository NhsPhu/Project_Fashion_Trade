// src/services/ReportService.js
import axios from 'axios';
import moment from 'moment';

const API_URL = 'http://localhost:8080/api/v1/admin/reports';

const formatDate = (date) => date.format('YYYY-MM-DDTHH:mm:ss');

export default {
    getRevenue: async (period, start, end) => {
        const res = await axios.get(`${API_URL}/revenue`, {
            params: { period, start: formatDate(start), end: formatDate(end) }
        });
        return res.data;
    },
    getOrders: async (start, end) => {
        const res = await axios.get(`${API_URL}/orders`, {
            params: { start: formatDate(start), end: formatDate(end) }
        });
        return res.data;
    },
    getTopProducts: async (limit = 10) => {
        const res = await axios.get(`${API_URL}/top-products`, { params: { limit } });
        return res.data;
    },
    getLowStock: async () => {
        const res = await axios.get(`${API_URL}/low-stock`);
        return res.data;
    },
    getCustomers: async (start, end) => {
        const res = await axios.get(`${API_URL}/customers`, {
            params: { start: formatDate(start), end: formatDate(end) }
        });
        return res.data;
    },
};