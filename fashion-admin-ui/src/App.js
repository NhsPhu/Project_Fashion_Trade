// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// USER
import UserApp from './user/UserApp'; // ĐÚNG: src/user/UserApp.js

// ADMIN
import { AuthProvider } from './contexts/AuthContext';
import AdminApp from './AdminApp'; // Đảm bảo file này tồn tại

const App = () => {
    return (
        <Routes>
            {/* USER ROUTES */}
            <Route path="/*" element={<UserApp />} />

            {/* ADMIN ROUTES */}
            <Route
                path="/admin/*"
                element={
                    <AuthProvider>
                        <AdminApp />
                    </AuthProvider>
                }
            />
        </Routes>
    );
};

export default App;