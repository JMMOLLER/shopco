import type { ProcessInputEvent } from "@components/react-components/InputQuantity";
import InputQuantity from "@components/react-components/InputQuantity";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import ToastMessage from "@libs/ToastMessage";
import addToCart from "@utils/addToCart";
import debounce from "@utils/debounce";

interface CartItemInputProps {
  product_details: ProductDetail;
  userId?: Window["user"];
  cart: CartItem;
}

type ProcessQuantityUpdate = (
  quantity: number,
  setter: React.Dispatch<React.SetStateAction<number>>,
  prev: number
) => Promise<void>;

function CartItemInput(props: CartItemInputProps) {
  const { cart, product_details, userId = null } = props;
  const [toast, setToast] = useState<MessageInstance | null>(null);
  const [quantity, setQuantity] = useState(cart.quantity);

  const handleAddToCart = useCallback<ProcessQuantityUpdate>(
    async (...args) => {
      const [quantity, setter, prev] = args;
      return addToCart({
        productDetailId: product_details.id,
        userId: userId,
        quantity
      })
        .then(() => {
          setQuantity(quantity);
        })
        .catch((err) => {
          console.error(err);
          setter(prev);
          toast && toast.error("Error updating product quantity");
        });
    },
    [toast]
  );

  const onIncrease = useCallback<ProcessInputEvent>(
    (...args) => {
      const [e, setter, prev] = args;
      const quantity = parseInt(e.value, 10);
      handleAddToCart(quantity, setter, prev);
    },
    [handleAddToCart]
  );

  const onDecrease = useCallback<ProcessInputEvent>(
    (...args) => {
      const [e, setter, prev] = args;
      const quantity = parseInt(e.value, 10);
      handleAddToCart(quantity, setter, prev);
    },
    [handleAddToCart]
  );

  // Envuelve las funciones en debounce
  const debouncedEncrease = useMemo(
    () => debounce(onIncrease, 400),
    [onIncrease]
  );
  const debouncedDecrease = useMemo(
    () => debounce(onDecrease, 400),
    [onDecrease]
  );

  useEffect(() => {
    ToastMessage.getInstance().then(setToast);
  }, []);

  return (
    <InputQuantity
      className="!h-fit max-nav:text-base"
      onIncrease={debouncedEncrease}
      onDecrease={debouncedDecrease}
      itemClass="max-nav:text-sm"
      max={product_details.stock}
      defaultValue={quantity}
    />
  );
}

export default CartItemInput;
