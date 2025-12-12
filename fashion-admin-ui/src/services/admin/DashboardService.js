// src/services/DashboardService.js

// 1. Import apiClient (có ngoặc nhọn) từ AuthService
// Nếu báo lỗi import, hãy thử đổi './AuthService' thành '../AuthService' tùy cấu trúc thư mục của bạn
import { apiClient } from '../AuthService';

const DashboardService = {
    getStats: async () => {
        try {
            // 2. Gọi API (apiClient đã tự gắn http://localhost:8080/api/v1)
            const response = await apiClient.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            // Log lỗi để dễ debug
            console.error("Dashboard Error:", error);
            throw error;
        }
    }
};

export default DashboardService;