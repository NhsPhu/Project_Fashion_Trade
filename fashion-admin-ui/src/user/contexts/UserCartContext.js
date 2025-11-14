// src/user/contexts/UserCartContext.js

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import UserCartService from '../../services/user/UserCartService';
import { useUserAuth } from './UserAuthContext';
import { SESSION_KEY } from '../../services/user/httpClient';

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
    // ignore
  }
  return newId;
};

export const UserCartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [sessionId, setSessionId] = useState(loadSessionId());
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useUserAuth();

  // BỌC getSessionId TRONG useCallback ĐỂ TRÁNH LỖI DEPENDENCY
  const getSessionId = useCallback(() => {
    return token ? null : sessionId;
  }, [token, sessionId]);

  const syncCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const sid = getSessionId();
      const response = await UserCartService.getCart(sid);
      if (!sid && response.sessionId) {
        localStorage.setItem(SESSION_KEY, response.sessionId);
        setSessionId(response.sessionId);
      }
      setCart(response);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [getSessionId]); // ĐÃ THÊM getSessionId

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const addItem = useCallback(async (payload) => {
    const sid = getSessionId();
    const response = await UserCartService.addItem(sid, payload);
    if (!sid && response.sessionId) {
      localStorage.setItem(SESSION_KEY, response.sessionId);
      setSessionId(response.sessionId);
    }
    setCart(response);
  }, [getSessionId]);

  const updateItem = useCallback(async (itemId, quantity) => {
    const sid = getSessionId();
    const response = await UserCartService.updateItem(sid, itemId, quantity);
    setCart(response);
  }, [getSessionId]);

  const removeItem = useCallback(async (itemId) => {
    const sid = getSessionId();
    await UserCartService.removeItem(sid, itemId);
    await syncCart();
  }, [getSessionId, syncCart]);

  const clearCart = useCallback(async () => {
    const sid = getSessionId();
    await UserCartService.clearCart(sid);
    setCart({ items: [], totalAmount: 0, totalItems: 0 });
  }, [getSessionId]);

  const value = useMemo(() => ({
    cart,
    sessionId,
    isLoading,
    syncCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  }), [cart, sessionId, isLoading, syncCart, addItem, updateItem, removeItem, clearCart]);

  return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
  );
};

export const useUserCart = () => useContext(CartContext);