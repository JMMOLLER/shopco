import { products } from "./products";
import { cart } from "./cart";


export const server = {
  ...products,
  ...cart
};
