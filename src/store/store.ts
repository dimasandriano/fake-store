import { create } from 'zustand';

import { CartSlice } from '@/store/CartSlice';
import { createCartSlice } from '@/store/CartSlice';

export const useStore = create<CartSlice>()((...a) => ({
  ...createCartSlice(...a),
}));
