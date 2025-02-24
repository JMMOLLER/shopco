import { actions, isActionError, isInputError } from "astro:actions";
import getLocalCart from "./localCart";
import { uuidv7 } from "uuidv7";

type Props = Omit<CartItem, "id" | "userId" | "timestamp"> & {
  userId: Window["user"];
  increase?: boolean;
};

export default async function addToCart(props: Props): Promise<void> {
  const { productDetailId, quantity, userId, increase = false } = props;

  if (!userId) {
    console.log("Adding product to local cart");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Add product to cart logic
    const cart = getLocalCart();
    const newId = uuidv7();
    cart.set(newId, {
      productDetailId,
      id: newId,
      quantity
    });
    localStorage.setItem("cart", JSON.stringify(Array.from(cart)));
    return Promise.resolve();
  } else {
    localStorage.removeItem("cart");
    const res = await actions.putProductInCart({
      userId: userId.id,
      productDetailId,
      quantity,
      increase
    });
    if (isActionError(res) || isInputError(res)) {
      throw new Error(res.message);
    } else if (res.error) {
      throw new Error(res.error.message);
    }
    return Promise.resolve();
  }
}
