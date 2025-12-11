// src/services/UserService.js
import { apiClient } from '../AuthService';

const UserService = {
    getAllUsers: async () => {
        try {
            const response = await apiClient.get('/admin/users');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await apiClient.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUserStatus: async (userId, status) => {
        try {
            const response = await apiClient.put(`/admin/users/${userId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUserRoles: async (userId, roles) => {
        try {
            const response = await apiClient.put(`/admin/users/${userId}/roles`, { roles });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default UserService;