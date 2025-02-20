import { atom, map } from "nanostores";

interface CartItem {
  [key: string]: Omit<Product, "inventory"> & { quantity: number };
}

export const isLoading = atom(false);
export const cartItems = map<CartItem>();
