import axios from 'axios';

// 1. Cấu hình đường dẫn gốc API
// Lưu ý: Các service con thường gọi endpoint bắt đầu từ sau /api
// Ví dụ: BrandService gọi '/admin/brands' -> Full URL: http://localhost:8080/api/admin/brands
const API_BASE_URL = 'http://localhost:8080/api/v1';
const TOKEN_KEY = 'accessToken';

// 2. Tạo instance Axios (apiClient) để dùng chung cho TOÀN BỘ APP
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Cấu hình Interceptor: Tự động gắn Token vào mỗi request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 4. Cấu hình Interceptor: Xử lý lỗi trả về (ví dụ 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Nếu token hết hạn hoặc không hợp lệ (Lỗi 401)
        if (error.response && error.response.status === 401) {
            // Có thể tự động logout hoặc refresh token tại đây
            // localStorage.removeItem(TOKEN_KEY);
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 5. Định nghĩa AuthService (Logic đăng nhập/đăng ký)
const AuthService = {
    /**
     * Gửi yêu cầu đăng nhập
     */
    login: async (email, password) => {
        try {
            // Gọi endpoint: http://localhost:8080/api/auth/login
            const response = await apiClient.post('/auth/login', { email, password });

            const data = response.data;
            const token = data.token || data.accessToken;

            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            }
            return data;
        } catch (error) {
            throw error.response ? error.response.data : { message: "Lỗi kết nối server" };
        }
    },

    /**
     * Gửi yêu cầu đăng ký (Customer)
     */
    register: async (registerData) => {
        try {
            // Gọi endpoint: http://localhost:8080/api/auth/register
            const response = await apiClient.post('/auth/register', registerData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : { message: "Lỗi kết nối server" };
        }
    },

    /**
     * Đăng xuất
     */
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
    },

    /**
     * Lấy token hiện tại
     */
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Giải mã Token lấy thông tin user
     */
    getCurrentUser: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }
};

export default AuthService;