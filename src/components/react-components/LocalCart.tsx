import { actions, isActionError, isInputError } from "astro:actions";
import getLocalCart, { setLocalCart } from "@utils/localCart";
import { slideRightAndUp } from "@utils/animation/removeItem";
import CartItemInput from "../../wrappers/CartItemInput";
import { cartItems, isLoading } from "@stores/cartStore";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import gsap from "gsap";

interface LocalCartItem {
  id: string;
  product_details: ProductDetail;
  product: Omit<Product, "inventory">;
  item: CartItem;
}

function LocalCart() {
  const $cartItems = useStore(cartItems);
  const $isLoading = useStore(isLoading);
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const deleteRef = useRef<HTMLButtonElement[]>([]);
  const containerRef = useRef<HTMLLIElement[]>([]);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLElement[]>([]);

  const loadCartProducts = async (localCart: LocalCart, ids: string[]) => {
    try {
      const res = await actions.getProductsInfo({ ids });
      if (isActionError(res) || isInputError(res) || res.error) {
        throw new Error(res.error?.message);
      }
      const products = res.data;
      return Array.from(localCart).reduce<LocalCartItem[]>(
        (acc, [key, value]) => {
          const product = products.find((p) => p.id === value.productId);
          if (product) {
            acc.push({
              id: key,
              product_details: value.productDetail,
              product,
              item: {
                id: key,
                productDetailId: value.productDetail.id,
                quantity: value.quantity,
                timestamp: value.timestamp,
                userId: ""
              }
            });
          }
          return acc;
        },
        []
      );
    } catch (error) {
      console.error("Failed to load cart products:", error);
      throw error;
    }
  };

  useEffect(() => {
    const localCart = getLocalCart();
    const ids = Array.from(localCart.values()).map((value) => value.productId);

    loadCartProducts(localCart, ids)
      .then((cart) => {
        setLoading(false);
        setItems(cart);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleClick = async (index: number) => {
    const btn = deleteRef.current[index];
    if (!btn) return;

    const article = articleRef.current[index];
    const container = containerRef.current[index];
    const parent = container?.closest("section");
    if (!container || !parent || !article) return;

    article.style.opacity = "0.5";
    container.classList.add("animate-shine");

    const id = article.dataset.id!;

    isLoading.set(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Calcula el ancho del elemento padre y añade 15px
    const toTranslate = container.offsetWidth + 15;

    // Desplaza el contenedor hacia la derecha
    gsap.to(container, {
      duration: 0.3,
      x: toTranslate,
      onComplete: (c, p) => {
        slideRightAndUp(c, p);
      },
      onCompleteParams: [container, parent]
    });

    // Elimina el producto del estado
    cartItems.setKey(id, undefined as any);
    isLoading.set(false);

    // Elimina el producto del carrito local
    const localCart = getLocalCart();
    localCart.delete(id);
    setLocalCart(localCart);
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      )}
      {!loading && items.length < 1 && (
        <div
          className="text-center text-lg px-2.5 max-nav:text-base opacity-50 cursor-default absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
          id="empty_cart"
        >
          <p>Your cart is empty. Don't miss out on our amazing products!</p>
          <div className="inline-flex flex-wrap justify-center gap-x-1">
            <p>Head over to the</p>
            <a
              className="hover:underline font-bold"
              aria-label="Shop page"
              href="/shop"
            >
              Shop
            </a>
            <p className="text-nowrap">and start adding your favorites now.</p>
          </div>
        </div>
      )}
      <ul aria-label="product items" className="space-y-6 overflow-x-hidden">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-lg"
            aria-label="item"
            ref={(el) => {
              containerRef.current[index] = el!;
            }}
          >
            <article
              className="inline-flex gap-x-4 w-full transition-opacity duration-200"
              aria-label="Product"
              data-id={item.id}
              ref={(el) => {
                articleRef.current[index] = el!;
              }}
            >
              <figure aria-label="Product Thumbnail">
                <img
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "/imgs/not-found.webp")
                  }
                  className="aspect-square max-w-28 max-nav:max-w-24 h-fit"
                  src={item.product.thumbnailUrl!}
                  alt={item.product.title}
                  decoding="async"
                />
              </figure>
              <div
                data-id={item.product_details.id}
                className="inline-flex gap-x-2 justify-between w-full"
              >
                <div
                  aria-label="Product details"
                  className="flex flex-col justify-between"
                >
                  <span>
                    <a
                      href={`shop/product/${item.product.id}`}
                      className="hover:underline"
                    >
                      <h4 className="font-bold text-lg max-nav:text-base max-nav:w-48 max-sm:w-24 truncate cursor-pointer">
                        {item.product.title}
                      </h4>
                    </a>
                    <p className="font-light text-sm">
                      <strong>Size:</strong>
                      {item.product_details.size}
                    </p>
                    <p className="font-light text-sm">
                      <strong>Color:</strong>
                      {item.product_details.color}
                    </p>
                  </span>
                  <data
                    className="font-bold text-xl max-nav:text-lg"
                    aria-label="current price"
                    value="120"
                  >
                    ${item.product.price ?? "$"}
                  </data>
                </div>
                <div className="flex flex-col justify-between">
                  <button
                    className="w-fit self-end aria-busy:cursor-not-allowed delete-btn"
                    aria-busy={$isLoading ? "true" : "false"}
                    aria-label="Delete cart product"
                    onClick={() => handleClick(index)}
                    ref={(el) => {
                      deleteRef.current[index] = el!;
                    }}
                    type="button"
                  >
                    <svg
                      width="24"
                      className="w-6 max-nav:w-5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.25 4.5H16.5v-.75a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 7.5 3.75v.75H3.75a.75.75 0 0 0 0 1.5h.75v13.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V6h.75a.75.75 0 1 0 0-1.5ZM10.5 15.75a.75.75 0 1 1-1.5 0v-6a.75.75 0 0 1 1.5 0v6Zm4.5 0a.75.75 0 1 1-1.5 0v-6a.75.75 0 1 1 1.5 0v6ZM15 4.5H9v-.75A.75.75 0 0 1 9.75 3h4.5a.75.75 0 0 1 .75.75v.75Z"
                        fill="#F33"
                      ></path>
                    </svg>
                  </button>
                  <CartItemInput
                    product_details={item.product_details}
                    product={item.product}
                    cart={item.item}
                    userId={null}
                  />
                </div>
              </div>
            </article>
            {items.length === index && <hr className="mt-6 border-primary" />}
          </li>
        ))}
      </ul>
    </>
  );
}

export default LocalCart;
