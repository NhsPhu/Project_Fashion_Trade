import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { AuthProvider } from './contexts/AuthContext';
import { UserCartProvider } from './contexts/UserCartContext';

import AppRoutes from './routes/AppRoutes'; // Import bộ định tuyến Gốc
import 'antd/dist/reset.css';
import './index.css';

const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLIC_KEY');

function App() {
    return (
        <AuthProvider>
            <UserCartProvider>
                <Elements stripe={stripePromise}>
                    <AppRoutes />
                </Elements>
            </UserCartProvider>
        </AuthProvider>
    );
}

export default App;
