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

    exportExcel: async (type, start, end) => {
        const params = { type };
        if (start && end) {
            params.start = start.format('YYYY-MM-DDTHH:mm:ss');
            params.end = end.format('YYYY-MM-DDTHH:mm:ss');
        }

        // Quan trọng: responseType 'blob' để nhận file
        const response = await api.get(`${API_PREFIX}/export/excel`, {
            params,
            responseType: 'blob'
        });

        // Xử lý download file
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