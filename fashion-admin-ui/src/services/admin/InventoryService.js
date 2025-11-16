// src/services/admin/InventoryService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)

// 2. SỬA LỖI: API_URL phải tương đối
const API_URL = '/admin/inventory';

// 3. SỬA LỖI: Xóa 'getHeaders', vì 'api' đã có interceptor (tự đính kèm token)
// const getHeaders = () => { ... };

const InventoryService = {
    getLowStock: async () => {
        // 4. SỬA LỖI: Dùng 'api' và xóa config 'headers'
        const response = await api.get(`${API_URL}/low-stock`);
        return response.data;
    },
    getStock: async (variantId, warehouseId) => {
        // 4. SỬA LỖI: Dùng 'api' và xóa config 'headers'
        const response = await api.get(
            `${API_URL}/${variantId}/${warehouseId}`
        );
        return response.data;
    },
    updateStock: async ({ variantId, warehouseId, quantity, action }) => {
        const payload = { variantId, warehouseId, quantity, action };
        // 4. SỬA LỖI: Dùng 'api' và xóa config 'headers'
        const response = await api.post(API_URL, payload);
        return response.data;
    },
};

export default InventoryService;