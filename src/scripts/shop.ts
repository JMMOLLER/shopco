import { actions, isActionError, isInputError } from "astro:actions";
import { $isFilterOpen, $pagination } from "@stores/shopStore";
import ToastMessage from "@libs/ToastMessage";
import debounce from "@utils/debounce";

document.addEventListener("astro:page-load", async () => {
  // Evitar que el script se ejecute en otras páginas
  // esto sucede cuando se usa client-side navigation
  if (!document.querySelector("main#shop")) return;

  // ===================== EVENTOS ===================== //

  /**
   * @description Evento personalizado definido en `Paginator.astro`
   */
  document.addEventListener("paginate", (event) => {
    const e = event as CustomEvent<{ page: number; popState: boolean }>;
    fetchProducts(e.detail.page, e.detail.popState);
  });

  const container = document.getElementById("products__container")!;
  const btnFilter = document.getElementById("filter__toggle")!;
  const loader = document.getElementById("products__loader")!;
  const info = document.getElementById("products__info")!;
  /**
   * @description Ancho de la ventana antes de redimensionar porque los dispositivos móviles suelen tener un alto dinámico
   */
  let prevWidth: number = window.innerWidth;

  btnFilter.addEventListener("click", () => {
    $isFilterOpen.set(true);
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      if (prevWidth !== window.innerWidth) {
        isLoading({ isLoading: true, beforeStart: flushArticles });
        fetchProducts(getCurrentPage(), true);
        prevWidth = window.innerWidth;
      }
    }, 200)
  );

  const paginator_container = document.getElementById("paginator__container")!;
  const current = paginator_container.getAttribute("data-current");
  const total = paginator_container.getAttribute("data-total");
  const isInLastPage = current === total;

  if (!isInLastPage && calcDynamicSize() !== container.querySelectorAll("article").length) {
    isLoading({ isLoading: true, beforeStart: flushArticles });
    fetchProducts(getCurrentPage());
  }

  const toast = await ToastMessage.getInstance();

  // ===================== FUNCIONES ===================== //

  function calcDynamicSize() {
    const isMobile = window.matchMedia("(max-width: 904px)").matches;
    const isLoading = container.getAttribute("aria-busy") === "true";
    isLoading && resetContainerStyles();

    const articles = Array.from(container.querySelectorAll("article"));
    let columns = 0;
    let productHeight = 0;

    if (articles.length === 0) {
      columns = detectColumnsByTempArticles();
      productHeight = getTempArticleHeight();
    } else {
      ({ columns, productHeight } = detectColumnsFromExisting(articles));

      const maxColumnsInRow = detectColumnsByTempArticles();

      if (columns < maxColumnsInRow) {
        columns += maxColumnsInRow;
        productHeight = getTempArticleHeight();
      }
    }

    isLoading && restoreContainerStyles();

    const minRows = isMobile ? 3 : 4;
    const rows = Math.max(
      minRows,
      Math.floor(window.innerHeight / productHeight)
    );

    return Math.max(6, columns * rows);
  }

  /**
   * @summary Resetea los estilos del contenedor para evitar distorsiones en la medición.
   */
  function resetContainerStyles() {
    container.classList.remove("flex", "h-full");
    container.classList.add("grid");
    loader.classList.add("hidden");
  }

  /**
   * @summary Restaura los estilos originales del contenedor después de la medición.
   */
  function restoreContainerStyles() {
    container.classList.remove("grid");
    container.classList.add("flex", "h-full");
    loader.classList.remove("hidden");
  }

  /**
   * @summary Detecta la cantidad de columnas utilizando los artículos actuales en el contenedor.
   * @param {HTMLElement[]} articles - Lista de artículos actuales en el contenedor.
   */
  function detectColumnsFromExisting(articles: HTMLElement[]) {
    let columns = 0;
    let prevOffsetTop = articles[0].offsetTop;

    for (const article of articles) {
      if (article.offsetTop > prevOffsetTop) {
        break;
      }
      columns++;
    }

    return { columns, productHeight: articles[0].offsetHeight };
  }

  /**
   * @summary Inserta artículos temporales hasta que se detecte un wrap (segunda fila) y devuelve el número de columnas detectadas.
   */
  function detectColumnsByTempArticles() {
    const tempArticles: HTMLElement[] = [];
    const columns = fillUntilWrap(tempArticles);
    tempArticles.forEach((el) => el.remove());
    return columns;
  }

  /**
   * @summary Obtiene la altura de un artículo temporal.
   */
  function getTempArticleHeight() {
    const tempArticle = generateTempArticle();
    container.appendChild(tempArticle);
    const height = tempArticle.offsetHeight;
    tempArticle.remove();
    return height;
  }

  /**
   * @summary Inserta artículos temporales hasta que se detecte un wrap (segunda fila).
   * @param {HTMLElement[]} tempArticles - Array donde se guardan los temporales para limpieza posterior.
   */
  function fillUntilWrap(tempArticles: HTMLElement[]) {
    let prevOffsetTop: number | undefined;
    let columns = 0;

    for (let i = 0; i < 100; i++) {
      const tempArticle = generateTempArticle();
      container.appendChild(tempArticle);
      tempArticles.push(tempArticle);

      if (prevOffsetTop === undefined) {
        prevOffsetTop = tempArticle.offsetTop;
      } else if (tempArticle.offsetTop > prevOffsetTop) {
        tempArticles.pop();
        tempArticle.remove();
        break;
      }
      columns++;
    }
    return columns;
  }

  type IsLoadingProps = {
    isLoading?: boolean;
    /**
     * @summary Función que se ejecuta después de que el loader se haya ocultado.
     */
    afterEnd?: (loader: HTMLElement) => void;
    /**
     * @summary Función que se ejecuta antes de que el loader se muestre.
     */
    beforeStart?: (loader: HTMLElement) => void;
  };

  function isLoading(props: IsLoadingProps) {
    const { isLoading = true, afterEnd, beforeStart } = props;

    beforeStart && beforeStart(loader);

    if (isLoading) {
      container.setAttribute("aria-busy", "true");
      container.classList.replace("grid", "flex");
      container.classList.add("h-full");
      loader.classList.remove("hidden");
    } else {
      container.setAttribute("aria-busy", "false");
      container.classList.replace("flex", "grid");
      container.classList.remove("h-full");
      loader.classList.add("hidden");
    }

    afterEnd && afterEnd(loader);
  }

  async function fetchProducts(page: number, isPopState = false) {
    // Scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Esperar a que la página se desplace al inicio
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Calcular la cantidad de productos a mostrar
    const size = calcDynamicSize();

    // Mostrar el loader y limpiar los productos actuales
    isLoading({
      beforeStart: flushArticles
    });

    // Obtener los productos de la página seleccionada
    const { data, error } = await actions.getProducts({ page, size });

    // Manejar errores de la petición
    if (isActionError(error) || isInputError(data)) {
      toast.error("Failed to fetch products");
      isLoading({ isLoading: false });
      return;
    }

    if (page > data.totalPages) {
      fetchProducts(data.totalPages);
      return;
    }

    if (!isPopState) {
      window.history.pushState({}, "", `?page=${page}`);
    }

    // Insertar los productos en el contenedor
    isLoading({
      isLoading: false,
      afterEnd: (loader) => {
        loader.insertAdjacentHTML("afterend", data!.html);
        info.textContent = `Showing ${page}-${data!.totalPages} of ${
          data!.total
        } Products`;
        $pagination.set({
          currentPage: page,
          totalPages: data!.totalPages,
          itemsPerPage: size
        });
      }
    });
  }
});

function flushArticles() {
  const container = document.getElementById("products__container")!;
  Array.from(container.querySelectorAll("article")).forEach((article) =>
    article.remove()
  );
}

function generateTempArticle() {
  const article = document.createElement("article");
  article.className = "mt-4 w-fit mx-auto"; // Asegúrate que use las mismas clases reales
  article.innerHTML = `
      <figure><img src="/imgs/skinny-jeans.webp" width="295" height="295" class="aspect-[99/100] w-[295px] rounded-[20px]"></figure>
      <div class="flex flex-col gap-2 mt-4 text-black">
        <h3 class="font-bold text-xl">Sample Product</h3>
        <div class="inline-flex justify-start items-center gap-1">
          <span class="text-xl/4 -my-[6px] inline-flex rating-star rating-star-[4.9]"></span>
          <p class="text-sm">4.9/<span class="opacity-60">5</span></p>
        </div>
        <div class="inline-flex items-center gap-3">
          <data class="font-bold text-[clamp(1.25rem,1.1257rem+0.4678vw,1.5rem)]">$99</data>
        </div>
      </div>
    `;
  return article;
}

function getCurrentPage() {
  const query = new URLSearchParams(window.location.search);
  return parseInt(query.get("page") || "1", 10);
}
