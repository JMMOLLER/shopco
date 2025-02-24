import { onRequestFail, slideRightAndUp } from "@utils/animation/removeItem";
import type { MessageInstance } from "antd/es/message/interface";
import { cartItems, isLoading } from "@stores/cartStore";
import { isActionError } from "astro:actions";
import ToastMessage from "@libs/ToastMessage";
import { isInputError } from "astro:actions";
import { actions } from "astro:actions";
import { gsap } from "gsap";

document.addEventListener("astro:page-load", async () => {
  const toast = await ToastMessage.getInstance();
  // Al cargar una nueva página, verifica si es la página de carrito
  if (document.querySelector("#cart-page")) {
    console.log("Cart page loaded");
    const delBtnNodes = document.querySelectorAll(
      "button.delete-btn"
    ) as NodeListOf<HTMLButtonElement>;

    if (delBtnNodes) {
      delBtnNodes.forEach((btn) =>
        btn.addEventListener("click", () =>
          handleClick(btn, Array.from(delBtnNodes), toast)
        )
      );
    }
  }
});

async function handleClick(
  btn: HTMLButtonElement,
  btns: HTMLButtonElement[],
  toast: MessageInstance
) {
  {
    btns.forEach((b) => {
      if (b !== btn) b.ariaBusy = "true";
    });
    if (btn.ariaBusy === "true") return;

    // Evita múltiples clicks
    btn.ariaBusy = "true";

    const article = btn.closest("article");
    const container = article?.parentElement;
    const parent = container?.closest("section");
    if (!container || !parent || !article) return;

    article.style.opacity = "0.5";
    container.classList.add("animate-shine");

    const id = article.dataset.id!;
    const detailId = article.querySelector("div")!.dataset.id!;

    isLoading.set(true);

    const res = await actions.deleteFromCart({ productDetailId: detailId });
    if (isActionError(res) || isInputError(res)) {
      console.error(res.message);
      return onRequestFail(container, article, toast, btns);
    } else if (res.error) {
      console.error(res.error.message);
      return onRequestFail(container, article, toast, btns);
    }

    // Calcula el ancho del elemento padre y añade 15px
    const toTranslate = container.offsetWidth + 15;

    // Desplaza el contenedor hacia la derecha
    gsap.to(container, {
      duration: 0.3,
      x: toTranslate,
      onComplete: (c, p) => {
        slideRightAndUp(c, p);
        btns.forEach((b) => (b.ariaBusy = "false"));
      },
      onCompleteParams: [container, parent]
    });

    // Elimina el producto del carrito
    cartItems.setKey(id, undefined as any);
    isLoading.set(false);
  }
}
