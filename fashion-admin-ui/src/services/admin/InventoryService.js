// src/services/InventoryService.js

// 1. SỬA IMPORT: Dùng 'api' từ ApiService (nơi đã cấu hình token chuẩn)
// Lưu ý: Nếu InventoryService nằm trong thư mục con (ví dụ services/admin/), hãy dùng ../ApiService
import api from '../ApiService';

const API_PREFIX = '/admin/inventory';

const InventoryService = {
    getLowStock: async () => {
        // 2. Thay 'apiClient' thành 'api'
        const response = await api.get(`${API_PREFIX}/low-stock`);
        return response.data;
    },

    getStock: async (variantId, warehouseId) => {
        const response = await api.get(`${API_PREFIX}/${variantId}/${warehouseId}`);
        return response.data;
    },

    getAllInventory: async () => {
        const response = await api.get(`${API_PREFIX}/all`);
        return response.data;
    },

    updateStock: async ({ variantId, warehouseId, quantity, action }) => {
        const payload = {
            variantId,
            warehouseId,
            quantity,
            action: (action === 'IN' || action === 'Nhập kho') ? 'IN' : 'OUT',
        };
        const response = await api.post(API_PREFIX, payload);
        return response.data;
    },
};

export default InventoryService;