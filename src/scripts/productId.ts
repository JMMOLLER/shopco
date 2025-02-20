import { actions, isActionError, isInputError } from "astro:actions";
import type { MessageInstance } from "antd/es/message/interface";
import ToastMessage from "@libs/ToastMessage";
import addToCart from "@utils/addToCart";

document.addEventListener("astro:page-load", async () => {
  const message = await ToastMessage.getInstance();
  // Al cargar una nueva página, verifica si es la página de producto
  if (document.querySelector("#product-page")) {
    initializeProductPage(message);
  }
});

async function initializeProductPage(message: MessageInstance) {
  const productId = window.location.pathname.split("/").pop();
  if (!productId || !UUIDValidator(productId)) return;

  const { data: product, error } = await actions.getProductById({
    id: productId
  });
  // Manejar errores de la petición
  if (isActionError(error)) alert(error.message);
  else if (isInputError(product)) alert(product.message);

  document.querySelectorAll('input[name="size"]')?.forEach((input) => {
    input.addEventListener("click", () => handleChange(product));
  });
  document.querySelectorAll('input[name="color"]')?.forEach((input) => {
    input.addEventListener("click", () => handleChange(product));
  });
  document
    .getElementById("add-to-cart")
    ?.addEventListener("click", (e) =>
      handleAddToCart({ event: e, product, message })
    );
}

function handleChange(product: Product) {
  const btnCart = document.getElementById("add-to-cart");
  const quantity = document.getElementById(
    "quantity"
  ) as HTMLInputElement | null;
  if (!btnCart || !quantity) return;

  // Deshabilitar botón de agregar al carrito
  btnCart.setAttribute("disabled", "true");

  // Obtener color seleccionado
  const colorName = queryInput(
    "",
    'input[name="color"]:checked + svg + span + span'
  ).getAttribute("data-color");

  // Obtener talla seleccionada
  const sizeName = queryInput(
    "",
    'input[name="size"]:checked + span'
  ).textContent;

  // Deshabilitar tallas
  document.querySelectorAll('input[name="size"]')?.forEach((input) => {
    input.setAttribute("disabled", "true");
  });

  /**
   * @summary Contiene el primer detalle de producto disponible que coincida con la talla seleccionada
   */
  let firstAvailable: ProductDetail | null = null;

  // Filtrar inventario por color
  for (const inventory of product.inventory) {
    if (inventory.color === colorName) {
      // Habilitar tallas disponibles
      const size = document.getElementById(
        `${inventory.size}-size`
      ) as HTMLInputElement;
      size.removeAttribute("disabled");

      // Guardar la primera talla disponible o la que coincida con la seleccionada
      if (firstAvailable && inventory.size === sizeName) {
        firstAvailable = inventory;
      } else {
        if (!firstAvailable) firstAvailable = inventory;
      }
    }
  }

  // Seleccionar talla disponible si la seleccionada no lo está
  if (queryInput("size").disabled) {
    queryInput("size").checked = false;
    const shouldSelected = queryInput("", 'input[name="size"]:not(:disabled)');
    if (shouldSelected) shouldSelected.checked = true;
    else if (firstAvailable) {
      const sizeBtn = document.getElementById(
        `${firstAvailable.size}-size`
      ) as HTMLInputElement;
      sizeBtn.checked = true;
      sizeBtn.removeAttribute("disabled");
    }
  }

  if (firstAvailable) {
    // Actualizar cantidad máxima y habilitar botón de agregar al carrito
    btnCart.setAttribute("data-selected-product", firstAvailable.id);
    quantity.setAttribute("max", firstAvailable.stock.toString());
    btnCart.removeAttribute("disabled");
    quantity.value = "1";
  } else {
    console.error("No se encontró el detalle seleccionado");
  }
}

type addToCartProps = {
  event: Event;
  product: Product;
  message: MessageInstance;
};

function handleAddToCart(props: addToCartProps) {
  const { event: e, product, message } = props;
  // Evitar que el formulario se envíe y obtener los datos del producto
  const el = e.target as HTMLButtonElement;
  const form = el.form || (el.closest("form") as HTMLFormElement);

  // Obtener cantidad y detalles del producto seleccionado
  const quantity = form.elements.namedItem("quantity") as HTMLInputElement;
  const productDetailId = el.getAttribute("data-selected-product") as string;

  // Agregar producto al carrito
  el.classList.add("load");
  el.setAttribute("disabled", "true");
  addToCart({
    productDetailId,
    userId: window.user,
    quantity: parseInt(quantity.value, 10),
    increase: true
  })
    .then(() => {
      message.success("Producto agregado al carrito");
    })
    .catch(() => {
      message.error("Error al agregar el producto al carrito");
    })
    .finally(() => {
      el.classList.remove("load");
      el.removeAttribute("disabled");
      form.reset();
      // Se llama a la función handleChange porque el form reset no dispara el evento change
      handleChange(product);
    });
}

/**
 *
 * @example (name, query) => document.querySelector(query ? query : `input[name="${name}"]:checked`)
 */
function queryInput(name: string, query?: string) {
  return document.querySelector(
    query ? query : `input[name="${name}"]:checked`
  ) as HTMLInputElement;
}

function UUIDValidator(str: string) {
  return new RegExp(/^[0-9a-f]{8}(?:\-[0-9a-f]{4}){3}-[0-9a-f]{12}$/gm).test(
    str
  );
}
