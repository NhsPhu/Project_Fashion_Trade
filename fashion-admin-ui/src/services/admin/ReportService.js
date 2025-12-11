<<<<<<< HEAD
// src/services/ReportService.js
import api from '../ApiService';

const API_PREFIX = '/admin/reports';

const ReportService = {
    getRevenue: async (period, start, end) => {
        const response = await api.get(`${API_PREFIX}/revenue`, {
            params: {
                period,
                start: start?.format('YYYY-MM-DDTHH:mm:ss'),
                end: end?.format('YYYY-MM-DDTHH:mm:ss')
            }
        });
        return response.data;
    },

    getOrders: async (start, end) => {
        const response = await api.get(`${API_PREFIX}/orders`, {
            params: {
                start: start?.format('YYYY-MM-DDTHH:mm:ss'),
                end: end?.format('YYYY-MM-DDTHH:mm:ss')
            }
        });
        return response.data;
    },

    getTopProducts: async (limit = 10) => {
        const response = await api.get(`${API_PREFIX}/top-products`, { params: { limit } });
        return response.data;
    },

    getLowStock: async () => {
        const response = await api.get(`${API_PREFIX}/low-stock`);
        return response.data;
    },

    getCustomers: async (start, end) => {
        const response = await api.get(`${API_PREFIX}/customers`, {
            params: {
                start: start?.format('YYYY-MM-DDTHH:mm:ss'),
                end: end?.format('YYYY-MM-DDTHH:mm:ss')
            }
        });
        return response.data;
    },

=======
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
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    exportExcel: async (type, start, end) => {
        const params = { type };
        if (start && end) {
            params.start = start.format('YYYY-MM-DDTHH:mm:ss');
            params.end = end.format('YYYY-MM-DDTHH:mm:ss');
        }
<<<<<<< HEAD

        // Quan trọng: responseType 'blob' để nhận file
        const response = await api.get(`${API_PREFIX}/export/excel`, {
=======
        // 3. SỬA LỖI: Dùng 'api'
        const response = await api.get(`${API_URL}/export/excel`, {
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
            params,
            responseType: 'blob'
        });

<<<<<<< HEAD
        // Xử lý download file
=======
        // ... (phần code tải file giữ nguyên) ...
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
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