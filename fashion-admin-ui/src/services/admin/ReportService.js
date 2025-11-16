// src/services/admin/ReportService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

// 2. SỬA LỖI: API_URL phải tương đối với baseURL
const API_URL = '/admin/reports';

const ReportService = {
    getRevenue: async (period, start, end) => {
        // 3. SỬA LỖI: Dùng 'api' thay vì 'axios'
        const res = await api.get(`${API_URL}/revenue`, {
            params: { period, start: start.format('YYYY-MM-DDTHH:mm:ss'), end: end.format('YYYY-MM-DDTHH:mm:ss') }
        });
        return res.data;
    },
    getOrders: async (start, end) => {
        // 3. SỬA LỖI: Dùng 'api'
        const res = await api.get(`${API_URL}/orders`, {
            params: { start: start.format('YYYY-MM-DDTHH:mm:ss'), end: end.format('YYYY-MM-DDTHH:mm:ss') }
        });
        return res.data;
    },
    getTopProducts: async (limit = 10) => {
        // 3. SỬA LỖI: Dùng 'api'
        const res = await api.get(`${API_URL}/top-products`, { params: { limit } });
        return res.data;
    },
    getLowStock: async () => {
        // 3. SỬA LỖI: Dùng 'api'
        const res = await api.get(`${API_URL}/low-stock`);
        return res.data;
    },
    getCustomers: async (start, end) => {
        // 3. SỬA LỖI: Dùng 'api'
        const res = await api.get(`${API_URL}/customers`, {
            params: { start: start.format('YYYY-MM-DDTHH:mm:ss'), end: end.format('YYYY-MM-DDTHH:mm:ss') }
        });
        return res.data;
    },
    exportExcel: async (type, start, end) => {
        const params = { type };
        if (start && end) {
            params.start = start.format('YYYY-MM-DDTHH:mm:ss');
            params.end = end.format('YYYY-MM-DDTHH:mm:ss');
        }
        // 3. SỬA LỖI: Dùng 'api'
        const response = await api.get(`${API_URL}/export/excel`, {
            params,
            responseType: 'blob'
        });

        // ... (phần code tải file giữ nguyên) ...
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