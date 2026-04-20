import { useState, useEffect } from 'react';
import { ProductListItem } from '@/features/catalog/product/models/product-list-response';

export interface CartItemData {
  product: ProductListItem;
  quantity: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);

  // Load giỏ hàng từ localStorage khi mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Lỗi khi parse giỏ hàng:', e);
      }
    }
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi thay đổi
  const saveCart = (items: CartItemData[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    // Dispatch event để các component khác cập nhật
    window.dispatchEvent(new Event('cart-updated'));
  };

  const addToCart = (product: ProductListItem, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(item => item.product.id === product.id);
    let newItems;
    if (existingIndex > -1) {
      newItems = [...cartItems];
      newItems[existingIndex].quantity += quantity;
    } else {
      newItems = [...cartItems, { product, quantity }];
    }
    saveCart(newItems);
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter(item => item.product.id !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const newItems = cartItems.map(item => 
      item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
