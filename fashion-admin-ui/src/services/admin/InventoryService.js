<<<<<<< HEAD
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
=======
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
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        return response.data;
    },

    updateStock: async ({ variantId, warehouseId, quantity, action }) => {
        const payload = {
            variantId,
            warehouseId,
            quantity,
<<<<<<< HEAD
            action: (action === 'IN' || action === 'Nhập kho') ? 'IN' : 'OUT',
        };
        const response = await api.post(API_PREFIX, payload);
=======
            action: action === 'IN' || action === 'Nhập kho' ? 'IN' : 'OUT',
        };
        const response = await api.post(API_URL, payload);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        return response.data;
    },
};

export default InventoryService;