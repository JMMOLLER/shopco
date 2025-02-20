import { isLoading, cartItems } from "@stores/cartStore";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";

function OrderSummary() {
  const $isCartLoading = useStore(isLoading);
  const $cart = useStore(cartItems);

  const formatCurrency = (val: number) => parseFloat(val.toFixed(2));

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [total, setTotal] = useState(0);

  /**
   * No se usa directamente los valores de los useMemos
   * porque Astro intenta renderizar el componente
   * como SSR y como los valores del store estan en el
   * cliente, entonces lo que calcule en el servidor
   * no coincidira con lo que se renderiza en el
   * cliente. Entonces Astro da un error de hydration.
   * entonces para que no se ponga a llorar lo hago
   * de esta manera. 😴
   */

  const memoSubTotal = useMemo(() => {
    const val = Object.values($cart).reduce(
      (acc, { price, quantity, discount }) => {
        const val = acc + price * quantity;
        if (discount) return val + (val * discount) / 100;
        return val;
      },
      0
    );
    return val || 0;
  }, [$cart]);

  const memoDiscount = useMemo(() => {
    const sum = Object.values($cart).reduce((acc, { price, quantity }) => {
      return acc + price * quantity;
    }, 0);
    const remainingBalance = subTotal - sum;
    return (remainingBalance / subTotal) * 100 || 0;
  }, [subTotal]);

  const memoBalance = useMemo(() => {
    return (subTotal * discount) / 100 || 0;
  }, [discount]);

  const memoDeliveryFee = useMemo(() => {
    const itemCount = Object.values($cart).reduce(
      (acc, { quantity }) => acc + quantity,
      0
    );
    if (itemCount === 0) return 0;
    return Math.max(7, itemCount * 2);
  }, [$cart]);

  const memoTotal = useMemo(() => {
    return subTotal + deliveryFee - balance || 0;
  }, [balance, subTotal, deliveryFee]);

  useEffect(() => {
    setSubTotal(memoSubTotal);
    setDiscount(memoDiscount);
    setBalance(memoBalance);
    setDeliveryFee(memoDeliveryFee);
    setTotal(memoTotal);
  }, [memoSubTotal, memoDiscount, memoBalance, memoDeliveryFee, memoTotal]);

  return (
    <section
      className="border border-primary rounded-3xl p-5 nav:px-6 nav:py-5 flex flex-col gap-y-6 max-nav:gap-y-4 h-fit"
      aria-labelledby="order_summary_heading"
    >
      <h2
        className="font-bold text-2xl/6 text-black"
        id="order_summary_heading"
      >
        Order Summary
      </h2>
      <div
        className="flex flex-col gap-y-5 max-nav:gap-y-3.5 text-lg max-nav:text-base font-light cursor-default aria-busy:cursor-wait group"
        aria-label="Order summary details"
        aria-busy={$isCartLoading}
      >
        <div aria-label="Subtotal" className="flex justify-between">
          <p>Subtotal</p>
          <p className="font-bold text-black group-aria-busy:animate-shine group-aria-busy:rounded-xl group-aria-busy:w-12 group-aria-busy:text-opacity-0 group-aria-busy:text-nowrap">
            ${formatCurrency(subTotal)}
          </p>
        </div>
        <div aria-label="Discount" className="flex justify-between">
          <p>Discount (-{formatCurrency(discount)}%)</p>
          <p className="text-red-600 font-bold group-aria-busy:animate-shine group-aria-busy:rounded-xl group-aria-busy:w-16 group-aria-busy:text-opacity-0 group-aria-busy:text-nowrap">
            -${formatCurrency(balance)}
          </p>
        </div>
        <div aria-label="Delivery fee" className="flex justify-between">
          <p>Delivery Fee</p>
          <p className="font-bold text-black group-aria-busy:animate-shine group-aria-busy:rounded-xl group-aria-busy:w-12 group-aria-busy:text-opacity-0 group-aria-busy:text-nowrap">
            ${deliveryFee}
          </p>
        </div>
        <hr className="border-primary" />
        <div aria-label="Total" className="flex justify-between">
          <p className="font-medium">Total</p>
          <p className="font-bold text-2xl max-nav:text-xl text-black group-aria-busy:animate-shine group-aria-busy:rounded-xl group-aria-busy:w-24 group-aria-busy:text-opacity-0">
            ${formatCurrency(total)}
          </p>
        </div>
      </div>

      <div className="inline-flex gap-x-3">
        <label className="relative grow" htmlFor="promo_code">
          <span className="sr-only">Add promo code</span>
          <input
            type="text"
            id="promo_code"
            autoComplete="off"
            placeholder="Add promo code"
            className="bg-primary rounded-3xl pl-12 px-4 py-3 w-full max-nav:text-sm"
          />
          <svg
            width="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-3 left-4"
            aria-label="Tag icon"
          >
            <path
              d="m23.077 12.486-9.312-9.312a1.861 1.861 0 0 0-1.325-.549H3.75A1.125 1.125 0 0 0 2.625 3.75v8.69a1.86 1.86 0 0 0 .55 1.325l9.31 9.312a1.875 1.875 0 0 0 2.652 0l7.94-7.94a1.875 1.875 0 0 0 0-2.651ZM13.81 21.22l-8.936-8.939V4.875h7.406l8.937 8.936-7.407 7.41ZM9.375 7.875a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
              fillOpacity=".4"
              fill="#000"
            ></path>
          </svg>
        </label>
        <button
          className="bg-black text-white max-nav:text-sm rounded-3xl px-8 py-3"
          aria-label="Apply discount code"
        >
          Apply
        </button>
      </div>

      <button
        className="bg-black rounded-full text-white max-nav:text-sm p-4 inline-flex gap-x-3 items-center justify-center"
        aria-label="Go to Checkout"
        type="button"
      >
        <span className="leading-3">Go to Checkout</span>
        <svg
          width="25"
          viewBox="0 0 25 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Arrow icon"
        >
          <path
            d="m14.796 4.454 6.75 6.75a1.124 1.124 0 0 1 0 1.594l-6.75 6.75a1.127 1.127 0 0 1-1.594-1.594l4.83-4.829H4.25a1.125 1.125 0 1 1 0-2.25h13.781l-4.83-4.829a1.127 1.127 0 1 1 1.594-1.594v.002Z"
            fill="#fff"
          ></path>
        </svg>
      </button>
    </section>
  );
}

export default OrderSummary;
