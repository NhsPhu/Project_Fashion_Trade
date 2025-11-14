// src/services/InventoryService.js
import axios from 'axios';

const API_URL = '/api/v1/admin/inventory';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

const InventoryService = {
    /**
     * Lấy danh sách hàng sắp hết kho (toàn hệ thống)
     */
    getLowStock: async () => {
        const response = await axios.get(`${API_URL}/low-stock`, { headers: getHeaders() });
        return response.data;
    },

    /**
     * Lấy tồn kho theo variantId + warehouseId
     */
    getStock: async (variantId, warehouseId) => {
        const response = await axios.get(
            `${API_URL}/${variantId}/${warehouseId}`,
            { headers: getHeaders() }
        );
        return response.data;
    },

    /**
     * Cập nhật tồn kho: IN (nhập), OUT (xuất)
     */
    updateStock: async ({ variantId, warehouseId, quantity, action }) => {
        const payload = { variantId, warehouseId, quantity, action };
        const response = await axios.post(API_URL, payload, { headers: getHeaders() });
        return response.data;
    },
};

export default InventoryService;