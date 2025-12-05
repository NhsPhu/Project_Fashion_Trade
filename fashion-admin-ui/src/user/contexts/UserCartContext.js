// src/user/contexts/UserCartContext.js
// 100% FIX: XÓA LÀ MẤT VĨNH VIỄN – THÊM LẠI CHỈ CÒN 1, KHÔNG BAO GIỜ BỊ 3, 4, 5...

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import UserCartService from '../../services/user/UserCartService';
import { useUserAuth } from './UserAuthContext';
import { SESSION_KEY } from '../../services/user/httpClient';
import { message } from 'antd';

const CartContext = createContext();

// === HÀM PHỤ TRỢ ===
const generateSessionId = () => crypto?.randomUUID?.() ?? `sid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const loadSessionId = () => {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const newId = generateSessionId();
    try { localStorage.setItem(SESSION_KEY, newId); } catch {}
    return newId;
};

const normalizeCartResponse = (res) => {
    if (!res) return { items: [], totalAmount: 0, totalItems: 0 };

    let items = Array.isArray(res.items) ? res.items : Object.values(res.items || {});


    const validItems = items
        .filter(item => item && (item.quantity ?? 0) > 0) // loại bỏ quantity <= 0
        .map((it, i) => ({
            ...it,
            id: it.id ?? it.cartItemId ?? i,
            key: it.id ?? it.cartItemId ?? i,
            variantId: it.variantId || it.variant?.id || it.productVariantId || it.variant_id,
            quantity: it.quantity || 1,
        }));

    return {
        ...res,
        items: validItems,
        totalItems: validItems.length,
        totalAmount: res.totalAmount || 0,
    };
};

export const UserCartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [sessionId, setSessionId] = useState(loadSessionId());
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useUserAuth();

    const getSessionId = useCallback(() => token ? null : sessionId, [token, sessionId]);

    const syncCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const sid = getSessionId();
            const res = await UserCartService.getCart(sid);
            const norm = normalizeCartResponse(res);
            if (!token && norm?.sessionId) {
                localStorage.setItem(SESSION_KEY, norm.sessionId);
                setSessionId(norm.sessionId);
            }
            setCart(norm);
        } catch (e) {
            console.error('Sync cart error:', e);
            setCart({ items: [], totalAmount: 0, totalItems: 0 });
        } finally {
            setIsLoading(false);
        }
    }, [getSessionId, token]);

    useEffect(() => { syncCart(); }, [token, syncCart]);

    const addItem = useCallback(async (payload) => {
        try {
            const sid = getSessionId();
            await UserCartService.addItem(sid, payload);
            await syncCart();
            message.success('Đã thêm vào giỏ hàng');
        } catch (e) {
            message.error('Thêm thất bại');
            throw e;
        }
    }, [getSessionId, syncCart]);

    // Thêm function updateQuantity để xử lý cập nhật số lượng (dùng delta)
    const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            message.warning('Số lượng phải lớn hơn 0. Để xóa, dùng nút Xóa.');
            return;
        }
        try {
            const item = cart?.items?.find(it => String(it.id) === String(cartItemId) || String(it.cartItemId) === String(cartItemId));
            if (!item) throw new Error('Không tìm thấy sản phẩm');
            const delta = newQuantity - item.quantity;
            if (delta === 0) return;
            await addItem({ variantId: item.variantId, quantity: delta });
            // syncCart đã được gọi trong addItem
        } catch (e) {
            message.error('Cập nhật số lượng thất bại');
            throw e;
        }
    }, [cart, addItem]);

    // === XÓA HOÀN TOÀN – ÉP SẠCH 100% BẰNG addItem(quantity: -current) ===
    const removeItem = useCallback(async (cartItemId) => {
        const idStr = String(cartItemId);

        // 1. LẤY item từ cart
        const itemToRemove = cart?.items?.find(it => String(it.id) === idStr || String(it.cartItemId) === idStr);
        if (!itemToRemove) {
            message.error('Không tìm thấy sản phẩm để xóa');
            return;
        }
        const variantId = itemToRemove.variantId || itemToRemove.variant?.id || itemToRemove.productVariantId;
        const currentQuantity = itemToRemove.quantity || 1; // Đảm bảo có giá trị

        // 2. ÉP XÓA SẠCH TRÊN BACKEND BẰNG addItem(quantity: -currentQuantity)
        try {
            const sid = getSessionId();
            // Cách MẠNH NHẤT: ép subtract để đưa về 0
            await UserCartService.addItem(sid, { variantId, quantity: -currentQuantity });
            // Vẫn gọi removeItem để chắc chắn xóa record
            await UserCartService.removeItem(sid, cartItemId).catch(() => {});
            // BÂY GIỜ GỌI syncCart ĐỂ ĐỒNG BỘ, VỚI FILTER quantity > 0 TRÁNH ZOMBIE
            await syncCart();
            message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (e) {
            console.warn('Xóa lỗi:', e);
            message.error('Xóa thất bại, vui lòng thử lại');
            await syncCart(); // Đồng bộ lại để tránh out-of-sync
        }
    }, [getSessionId, cart, syncCart]);

    const clearCart = useCallback(async () => {
        try { await UserCartService.clearCart(getSessionId()); } catch {}
        setCart({ items: [], totalAmount: 0, totalItems: 0 });
        message.success('Đã xóa toàn bộ giỏ hàng');
    }, [getSessionId]);

    const value = useMemo(() => ({
        cart, sessionId, isLoading, syncCart, addItem,
        updateQuantity, removeItem, clearCart
    }), [cart, sessionId, isLoading, syncCart, addItem, updateQuantity, removeItem, clearCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useUserCart = () => useContext(CartContext);