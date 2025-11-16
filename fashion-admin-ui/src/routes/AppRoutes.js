import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Import từ thư mục hiện tại (./)
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes'; // <-- LỖI CỦA BẠN LÀ Ở ĐÂY

/**
 * Đây là bộ định tuyến GỐC (Root)
 * Nó quyết định khi nào hiển thị Admin và khi nào hiển thị User
 */
function AppRoutes() {
    return (
        <Routes>
            {/* 1. Nếu đường dẫn là /admin/*,
                hãy giao toàn quyền kiểm soát cho AdminRoutes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 2. Nếu là bất kỳ đường dẫn nào khác (/*),
                hãy giao quyền kiểm soát cho UserRoutes */}
            <Route path="/*" element={<UserRoutes />} />
        </Routes>
    );
}

export default AppRoutes;