<<<<<<< HEAD
// src/services/DashboardService.js

// 1. Import apiClient (có ngoặc nhọn) từ AuthService
// Nếu báo lỗi import, hãy thử đổi './AuthService' thành '../AuthService' tùy cấu trúc thư mục của bạn
import { apiClient } from '../AuthService';
=======
<<<<<<<< HEAD:fashion-admin-ui/src/services/DashboardService.js
// src/services/DashboardService.js
import { apiClient } from './AuthService';
========
// src/services/admin/DashboardService.js
import api from '../ApiService'; // 1. SỬA LỖI: Import instance TRUNG TÂM (chú ý ../)
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/DashboardService.js
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22

const DashboardService = {
    getStats: async () => {
        try {
<<<<<<< HEAD
            // 2. Gọi API (apiClient đã tự gắn http://localhost:8080/api/v1)
            const response = await apiClient.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            // Log lỗi để dễ debug
            console.error("Dashboard Error:", error);
=======
<<<<<<<< HEAD:fashion-admin-ui/src/services/DashboardService.js
            console.log("🚀 Đang gọi API Dashboard: /admin/dashboard/stats");

            const response = await apiClient.get('/admin/dashboard/stats');

            console.log("✅ Kết quả Dashboard:", response.data);
========
            // 2. SỬA LỖI: Dùng 'api' và xóa '/api/v1'
            const response = await api.get('/admin/dashboard/stats');
>>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22:fashion-admin-ui/src/services/admin/DashboardService.js
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
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
            throw error;
        }
    }
};

export default DashboardService;