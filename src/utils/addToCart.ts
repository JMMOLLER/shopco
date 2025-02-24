import { actions, isActionError, isInputError } from "astro:actions";
import getLocalCart from "./localCart";
import { uuidv7 } from "uuidv7";

type Props = {
  productDetailId: string;
  userId: Window["user"];
  increase?: boolean;
  quantity: number;
};

export default async function addToCart(props: Props): Promise<void> {
  const { productDetailId, quantity, userId, increase = false } = props;

  if (!userId) {
    const res = await actions.getProductDetailById({ id: productDetailId });
    if (isActionError(res)) {
      throw new Error(res.message);
    } else if (isInputError(res)) {
      throw new Error(res.message);
    } else if (res.error) {
      throw new Error(res.error.message);
    }
    debugger
    // Add product to cart logic
    const productDetail = res.data as ProductDetail;
    const cart = getLocalCart();
    const newId = uuidv7();

    // Check if product already exists in cart
    const existingProduct = Array.from(cart).find(
      ([_, item]) => item.productDetail.id === productDetailId
    )?.[1];

    if (existingProduct) {
      cart.set(existingProduct.id, {
        ...existingProduct,
        quantity: increase ? existingProduct.quantity + quantity : quantity
      });
    } else {
      cart.set(newId, {
        timestamp: new Date().toISOString(),
        productId: productDetail.productId,
        productDetail,
        id: newId,
        quantity
      });
    }

    // Update cart
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
