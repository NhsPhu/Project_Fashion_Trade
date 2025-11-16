import React from 'react';

// (Đảm bảo các đường dẫn Context này là chính xác!)
import { AuthProvider as AdminAuthProvider } from './contexts/AuthContext';
import { UserAuthProvider } from './contexts/UserAuthContext';
import { UserCartProvider } from './contexts/UserCartContext';

import AppRoutes from './routes/AppRoutes'; // Import bộ định tuyến Gốc
import 'antd/dist/reset.css';
import './index.css';

function App() {
    return (
        // Bọc Context của Admin
        <AdminAuthProvider>
            {/* Bọc Context của User (Khách hàng) */}
            <UserAuthProvider>
                <UserCartProvider>
                    {/* AppRoutes (bộ định tuyến) phải nằm BÊN TRONG
                        tất cả các Provider mà nó sử dụng */}
                    <AppRoutes />
                </UserCartProvider>
            </UserAuthProvider>
        </AdminAuthProvider>
    );
}

export default App;