// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import file App đã gộp ở bước trước
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Không cần BrowserRouter ở đây nữa vì đã có trong App.js */}
        <App />
    </React.StrictMode>
);