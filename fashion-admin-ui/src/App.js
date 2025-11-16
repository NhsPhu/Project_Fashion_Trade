import React from 'react';

// 1. SỬA: Chỉ import 1 AuthProvider HỢP NHẤT
import { AuthProvider } from './contexts/AuthContext';
// 2. XÓA: UserAuthProvider
import { UserCartProvider } from './contexts/UserCartContext';

import AppRoutes from './routes/AppRoutes'; // Import bộ định tuyến Gốc
import 'antd/dist/reset.css';
import './index.css';

function App() {
    return (
        // 3. SỬA: Chỉ dùng AuthProvider HỢP NHẤT
        <AuthProvider>
            <UserCartProvider>
                <AppRoutes />
            </UserCartProvider>
        </AuthProvider>
    );
}

export default App;