import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import UserCartService from '../services/user/UserCartService';
import { useAuth } from './AuthContext';
import { SESSION_KEY } from '../services/user/httpClient';

const CartContext = createContext();

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `sid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

const loadSessionId = () => {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const newId = generateSessionId();
  try {
    localStorage.setItem(SESSION_KEY, newId);
  } catch (e) {
    console.error('Error saving session ID to localStorage:', e);
  }
  return newId;
};

export const UserCartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(loadSessionId());

  const { token } = useAuth();

  const getSessionId = useCallback(() => {
    return token ? null : sessionId;
  }, [token, sessionId]);

  const syncCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const sid = getSessionId();
      const response = await UserCartService.getCart(sid);
      if (!token && !sid && response.sessionId) {
        localStorage.setItem(SESSION_KEY, response.sessionId);
        setSessionId(response.sessionId);
      }
      console.log("Cart synced:", response);
      setCart(response);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [getSessionId, token]);

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const addItem = useCallback(async (payload) => {
    try {
        const sid = getSessionId();
        await UserCartService.addItem(sid, payload);
        await syncCart();
    } catch (error) {
        console.error("Add item error:", error);
        throw error;
    }
  }, [getSessionId, syncCart]);

  const updateItem = useCallback(async (itemId, quantity) => {
    try {
        const sid = getSessionId();
        await UserCartService.updateItem(sid, itemId, quantity);
        await syncCart();
    } catch (error) {
        console.error("Update item error:", error);
    }
  }, [getSessionId, syncCart]);

  const removeItem = useCallback(async (itemId) => {
    try {
        const sid = getSessionId();
        await UserCartService.removeItem(sid, itemId);
        await syncCart();
    } catch (error) {
        console.error("Remove item error:", error);
    }
  }, [getSessionId, syncCart]);

  const clearCart = useCallback(async () => {
    try {
        const sid = getSessionId();
        await UserCartService.clearCart(sid);
        setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } catch (error) {
        console.error("Clear cart error:", error);
    }
  }, [getSessionId]);

  // HÀM MỚI: Chỉ xóa giỏ hàng ở frontend
  const clearCartFrontendOnly = useCallback(() => {
    setCart({ items: [], totalAmount: 0, totalItems: 0 });
  }, []);

  const value = useMemo(() => ({
    cart,
    sessionId,
    isLoading,
    syncCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    clearCartFrontendOnly, // Export hàm mới
  }), [cart, sessionId, isLoading, syncCart, addItem, updateItem, removeItem, clearCart, clearCartFrontendOnly]);

  return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
  );
};

export const useUserCart = () => useContext(CartContext);
