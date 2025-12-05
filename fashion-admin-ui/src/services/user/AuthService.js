import axios from 'axios';

// 1. Đảm bảo cổng (port) này khớp với backend của bạn (8080 hoặc 8083)
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Tạo một "instance" của axios
 * (Chúng ta dùng apiClient riêng cho Auth để không bị xung đột
 * với 'axios.defaults' mà AuthContext quản lý)
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const AuthService = {

    /**
     * API Đăng nhập
     */
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', {
                email: email,
                password: password
            });

            if (response.data && response.data.accessToken) {
                const token = response.data.accessToken;
                localStorage.setItem('admin_token', token);
                return token;
            } else {
                throw new Error('Phản hồi không hợp lệ từ máy chủ');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error.response?.data || error.message);
            throw new Error(error.response?.data || 'Đăng nhập thất bại');
        }
    },

    // ========== 2. THÊM HÀM MỚI ==========
    /**
     * API Đăng ký Khách hàng
     * @param {object} registerData (chứa fullName, email, password, phone)
     */
    register: async (registerData) => {
        try {
            // Gọi API /register mới
            const response = await apiClient.post('/auth/register', registerData);
            return response.data; // Trả về thông báo thành công
        } catch (error) {
            console.error('Lỗi đăng ký:', error.response?.data || error.message);
            // Ném lỗi (ví dụ: "Email đã được sử dụng")
            throw new Error(error.response?.data || 'Đăng ký thất bại');
        }
    },
    // ===================================

    /**
     * Lấy token từ localStorage
     */
    getToken: () => {
        return localStorage.getItem('admin_token');
    },

    /**
     * Xóa token (Đăng xuất)
     */
    logout: () => {
        localStorage.removeItem('admin_token');
    }
};

export default AuthService;