// src/services/admin/InventoryService.js
import api from '../ApiService';

const API_URL = '/admin/inventory';

const InventoryService = {
    // Lấy danh sách sản phẩm tồn kho thấp
    getLowStock: async () => {
        const response = await api.get(`${API_URL}/low-stock`);
        return response.data;
    },

    // Lấy tồn kho của 1 variant trong 1 kho cụ thể
    getStock: async (variantId, warehouseId) => {
        const response = await api.get(`${API_URL}/${variantId}/${warehouseId}`);
        return response.data;
    },

    // THÊM DÒNG NÀY – gọi đúng API /all ở backend
    getAllInventory: async () => {
        const response = await api.get(`${API_URL}/all`);
        return response.data;
    },

    updateStock: async ({ variantId, warehouseId, quantity, action }) => {
        const payload = {
            variantId,
            warehouseId,
            quantity,
            action: action === 'IN' || action === 'Nhập kho' ? 'IN' : 'OUT',
        };
        const response = await api.post(API_URL, payload);
        return response.data;
    },
};

export default InventoryService;