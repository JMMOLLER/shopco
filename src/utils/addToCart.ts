import getLocalCart from "./getLocalCart";
import { uuidv7 } from "uuidv7";

/**
 * @todo Pendiente crear un action para agregar un producto al carrito del usuario autenticado y llamarlo desde aqui
 */

type Props = Omit<CartItem, "id">;

export default async function addToCart(props: Props): Promise<void> {
  const { productDetailId, productId, quantity } = props;
  console.log(`Adding product ${productId} to cart`);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Add product to cart logic
  const cart = getLocalCart();
  const newId = uuidv7();
  cart.set(newId, {
    productDetailId,
    id: newId,
    productId,
    quantity
  });
  localStorage.setItem("cart", JSON.stringify(Array.from(cart)));
  return Promise.resolve();
}
