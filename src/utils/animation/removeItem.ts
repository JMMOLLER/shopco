import type { MessageInstance } from "antd/es/message/interface";
import gsap from "gsap";

export function slideRightAndUp(element: HTMLElement, parent: HTMLElement) {
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

export function fadeOut(
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

export function validateEmptyCart(parent: HTMLElement) {
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

export function onRequestFail(
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