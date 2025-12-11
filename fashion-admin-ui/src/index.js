<<<<<<< HEAD
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import file App đã gộp ở bước trước
=======
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';  // ĐÚNG ĐƯỜNG DẪN
import App from './App';
import 'antd/dist/reset.css';
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
<<<<<<< HEAD
        {/* Không cần BrowserRouter ở đây nữa vì đã có trong App.js */}
        <App />
=======
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    </React.StrictMode>
);  