// src/services/DashboardService.js
import { apiClient } from './AuthService';

const DashboardService = {
    getStats: async () => {
        try {
            console.log("🚀 Đang gọi API Dashboard: /admin/dashboard/stats");

            const response = await apiClient.get('/admin/dashboard/stats');

            console.log("✅ Kết quả Dashboard:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi gọi Dashboard API:");
            if (error.response) {
                // Server trả về lỗi (401, 403, 500)
                console.error("- Status:", error.response.status);
                console.error("- Data:", error.response.data);
            } else if (error.request) {
                // Không nhận được phản hồi (thường do CORS hoặc Server tắt)
                console.error("- Không có phản hồi từ Server (Kiểm tra CORS hoặc Server có đang chạy không?)");
            } else {
                console.error("- Lỗi:", error.message);
            }
            throw error;
        }
    }
};

export default DashboardService;