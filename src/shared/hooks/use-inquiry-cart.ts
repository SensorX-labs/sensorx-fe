'use client';

import { useState, useEffect, useCallback } from 'react';

export interface InquiryCartItem {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unit: string;
    manufacturer: string;
}

const STORAGE_KEY = 'inquiryCart';
const CART_CHANGED_EVENT = 'inquiryCartChanged';

const readFromStorage = (): InquiryCartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const writeToStorage = (items: InquiryCartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Phát event để tất cả hook instances đồng bộ
    window.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));
};

export const useInquiryCart = () => {
    const [items, setItems] = useState<InquiryCartItem[]>([]);

    // Khởi tạo + lắng nghe thay đổi từ các component khác
    useEffect(() => {
        setItems(readFromStorage());

        const handleCartChange = () => {
            setItems(readFromStorage());
        };

        window.addEventListener(CART_CHANGED_EVENT, handleCartChange);
        return () => window.removeEventListener(CART_CHANGED_EVENT, handleCartChange);
    }, []);

    const addItem = useCallback((item: Omit<InquiryCartItem, 'quantity'> & { quantity?: number }) => {
        const current = readFromStorage();
        const qty = item.quantity ?? 1;
        const existing = current.find(i => i.productId === item.productId);
        let next: InquiryCartItem[];

        if (existing) {
            next = current.map(i =>
                i.productId === item.productId
                    ? { ...i, quantity: i.quantity + qty }
                    : i
            );
        } else {
            next = [...current, { ...item, quantity: qty }];
        }

        writeToStorage(next);
    }, []);

    const removeItem = useCallback((productId: string) => {
        const current = readFromStorage();
        const next = current.filter(i => i.productId !== productId);
        writeToStorage(next);
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) return;
        const current = readFromStorage();
        const next = current.map(i =>
            i.productId === productId ? { ...i, quantity } : i
        );
        writeToStorage(next);
    }, []);

    const clearCart = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));
        }
    }, []);

    const getItemQuantity = useCallback((productId: string) => {
        const item = items.find(i => i.productId === productId);
        return item?.quantity ?? 0;
    }, [items]);

    const hasItem = useCallback((productId: string) => {
        return items.some(i => i.productId === productId);
    }, [items]);

    return {
        items,
        totalItems: items.length,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        hasItem,
        getItemQuantity,
    };
};
