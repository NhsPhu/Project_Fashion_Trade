// src/user/UserApp.js

import React from 'react';
import { UserAuthProvider } from './contexts/UserAuthContext';
import { UserCartProvider } from './contexts/UserCartContext';
import UserRoutes from './routes/UserRoutes';

const UserApp = () => {
    return (
        <UserAuthProvider>
            <UserCartProvider>
                <UserRoutes />
            </UserCartProvider>
        </UserAuthProvider>
    );
};

export default UserApp;