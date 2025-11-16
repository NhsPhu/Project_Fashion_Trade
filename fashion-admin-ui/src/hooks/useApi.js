// src/hooks/useApi.js
import { useState } from 'react';
import ApiService from '../services/ApiService';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (apiCall) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            return { data: result, error: null };
        } catch (err) {
            setError(err);
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, request };
};