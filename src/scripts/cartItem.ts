import type { MessageInstance } from "antd/es/message/interface";
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
  }
}

function slideRightAndUp(element: HTMLElement, parent: HTMLElement) {
  var nextAll = [];
  var sibling = element.nextElementSibling;

  // Valida si el carrito estaría vacío
  validateEmptyCart(parent);

  sibling &&
    gsap.to(sibling, {
      duration: 0.3,
      marginTop: 0,
      ease: "power1.out"
    });

  while (sibling) {
    nextAll.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  var listH = element.offsetHeight;
  var listMargin = parseInt(window.getComputedStyle(element).marginBottom, 10);

  gsap.to(nextAll, {
    duration: 0.5,
    y: -(listH + listMargin),
    onComplete: fadeOut,
    onCompleteParams: [element, nextAll, parent]
  });
}

function fadeOut(
  element: HTMLElement,
  nextElements: HTMLElement[],
  parent: HTMLElement
) {
  // Altura inicial de <section> antes de eliminar el <li>
  const initialHeight = parent.offsetHeight;

  // Simula la eliminación del <li> para calcular la nueva altura
  element.style.display = "none";
  const finalHeight = parent.offsetHeight;
  element.style.display = ""; // Revertimos para que siga visible hasta la animación

  // Evita saltos visuales bloqueando la altura antes de animar
  gsap.set(parent, { height: initialHeight, overflow: "hidden" });

  gsap.to(element, {
    duration: 0.1,
    autoAlpha: 0,
    transformOrigin: "0 50%",
    onComplete: () => {
      element.remove(); // Elimina el <li>
      gsap.set(nextElements, { clearProps: "all" });

      // Anima la altura de <section>
      gsap.to(parent, {
        duration: 0.3,
        height: finalHeight,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(parent, { clearProps: "all" });
        }
      });
    }
  });
}

function validateEmptyCart(parent: HTMLElement) {
  const ul = parent.querySelector("ul");
  if (ul && ul.childElementCount === 1) {
    const text = parent.querySelector("#empty_cart") as HTMLElement | null;
    if (!text) return;

    text.style.removeProperty("display");
    setTimeout(() => {
      text.style.removeProperty("opacity");
    }, 1);
    text.setAttribute("aria-hidden", "false");
  }
}

function onRequestFail(
  container: HTMLElement,
  article: HTMLElement,
  toast: MessageInstance,
  deleteBtns: HTMLButtonElement[]
) {
  toast.error("An error occurred. Please try again.");
  deleteBtns.forEach((b) => (b.ariaBusy = "false"));
  container.classList.remove("animate-shine");
  article.style.opacity = "";
  return;
}
