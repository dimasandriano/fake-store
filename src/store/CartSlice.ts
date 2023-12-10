import { StateCreator } from 'zustand';

import { cart } from '@/types/cart.type';

export interface CartSlice {
  cartItems: cart[];
  addToCart: (item: cart) => void;
  removeFromCart: (id: number) => void;
  addQty: (id: number) => void;
  removeQty: (id: number) => void;
  isOnCart: (id: number) => boolean;
  total: () => number;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  cartItems: [],
  addToCart: (item: cart) =>
    set((state) => ({ cartItems: [...state.cartItems, item] })),
  removeFromCart: (id: number) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  addQty: (id: number) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    })),
  removeQty: (id: number) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item,
      ),
    })),
  isOnCart: (id: number) => get().cartItems.some((item) => item.id === id),
  total: () =>
    get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
});
