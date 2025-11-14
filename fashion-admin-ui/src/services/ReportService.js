// src/services/ReportService.js
import axios from 'axios';

const API_URL = '/api/v1/admin/reports';

const ReportService = {
    getRevenue: async (period, start, end) => {
        const res = await axios.get(`${API_URL}/revenue`, {
            params: { period, start: start.format('YYYY-MM-DDTHH:mm:ss'), end: end.format('YYYY-MM-DDTHH:mm:ss') }
        });
        return res.data;
    },
    getOrders: async (start, end) => {
        const res = await axios.get(`${API_URL}/orders`, {
            params: { start: start.format('YYYY-MM-DDTHH:mm:ss'), end: end.format('YYYY-MM-DDTHH:mm:ss') }
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
            params: { start: start.format('YYYY-MM-DDTHH:mm:ss'), end: end.format('YYYY-MM-DDTHH:mm:ss') }
        });
        return res.data;
    },

    // THÊM: Xuất Excel
    exportExcel: async (type, start, end) => {
        const params = { type };
        if (start && end) {
            params.start = start.format('YYYY-MM-DDTHH:mm:ss');
            params.end = end.format('YYYY-MM-DDTHH:mm:ss');
        }

        const response = await axios.get(`${API_URL}/export/excel`, {
            params,
            responseType: 'blob'  // BẮT BUỘC để tải file
        });

        // Tạo link tải
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'bao_cao.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
};

export default ReportService;