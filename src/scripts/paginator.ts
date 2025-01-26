import getPageNumbers from "@utils/getPageNumbers";

document.addEventListener("astro:page-load", () => {
  // Evitar que el script se ejecute en otras páginas
  // esto sucede cuando se usa client-side navigation
  if (window.location.pathname !== "/shop") return;

  const getPaginator = () => document.querySelectorAll("#paginator__container > *")!;
  const btnPrev = document.getElementById("paginator__prev")!;
  const btnNext = document.getElementById("paginator__next")!;

  const lastCreatedPages: (string | number)[] = [];
  let lastSelectedPage: HTMLElement | null = null;
  let lastVisiblePages: number | null = null;

  // Eventos de los botones de navegación
  btnPrev.addEventListener("click", () => handleNavigation("prev"));
  btnNext.addEventListener("click", () => handleNavigation("next"));

  // Inicializar el paginador
  handleInit();

  // Actualizar el paginador al cambiar el tamaño de la ventana
  window.addEventListener("resize", handleInit);

  // Evento del botón del navegador a página anterior
  window.addEventListener("popstate", async (e) => {
    const currentPage = getCurrentPage();
    selectPaginatorPage(currentPage);
    dispatchPaginatorEvent(currentPage, true);
  });

  // ===================== FUNCIONES ===================== //

  /**
   * @description Inicializa el paginador con el número de páginas visibles adecuado
   */
  function handleInit() {
    let visiblePages = 7;

    // Forzar la creación del paginador si la última página es "..."
    if (lastCreatedPages.findIndex(e => e === getCurrentPage())) lastVisiblePages = null;

    if (window.innerWidth > 600 && lastVisiblePages !== 7) {
      createNavPaginator(visiblePages);
      lastVisiblePages = visiblePages;
    } else if (
      window.innerWidth <= 600 &&
      window.innerWidth > 500 &&
      lastVisiblePages !== 5
    ) {
      visiblePages = 5;
      createNavPaginator(visiblePages);
      lastVisiblePages = visiblePages;
    } else if (window.innerWidth <= 500 && lastVisiblePages !== 3) {
      visiblePages = 3;
      createNavPaginator(visiblePages);
      lastVisiblePages = visiblePages;
    }
  }

  /**
   * @description Crea el paginador de navegación con el número de páginas visibles
   * @param visiblePages Número de páginas visibles en el paginador
   */
  function createNavPaginator(visiblePages?: number) {
    const nav = document.querySelector("#paginator__container")!;
    nav.setAttribute("aria-hidden", "false");
    const props: PaginatorType = {
      currentPage: parseInt(nav.getAttribute("data-current")!, 10),
      totalPages: parseInt(nav.getAttribute("data-total")!, 10),
      total: 0
    };
    nav.innerHTML = "";

    // Crear los botones de paginación
    lastCreatedPages.length = 0;
    lastCreatedPages.push(...getPageNumbers({ ...props, maxVisiblePages: visiblePages }))
    lastCreatedPages.forEach(
      (page) => {
        const button = document.createElement("button");
        button.classList.add("shadow-md", "w-10", "h-10", "rounded-md", "max-md:w-[34px]", "max-md:h-[34px]", "max-md:text-sm");
        button.setAttribute("aria-label", `Página ${page}`);
        button.textContent = typeof page === "number" ? page.toString() : "...";
        if (typeof page === "number") {
          if (page === props.currentPage) {
            button.classList.add("bg-primary");
            lastSelectedPage = button;
          }
          button.addEventListener("click", handleClick);
        } else {
          button.classList.add("btn-disabled", "cursor-default");
          button.setAttribute("disabled", "");
        }
        nav.appendChild(button);
      }
    );
  }

  /**
   * @description Selecciona la página del paginador que se ha clickeado
   * @param page El número de página a seleccionar
   */
  function selectPaginatorPage(page: number) {
    if (!lastSelectedPage)
      return console.error("No se ha encontrado la página seleccionada");

    // Actualizar a la página seleccionada
    lastSelectedPage.classList.remove("bg-primary");
    lastSelectedPage = getPaginator()[page - 1] as HTMLElement;
    lastSelectedPage.classList.add("bg-primary");

    // Actualizar el atributo data-current
    const nav = document.querySelector("#paginator__container")!;
    nav.setAttribute("data-current", page.toString());
  }

  function handleClick(e: Event) {
    const page = e.target as HTMLElement;
    const currentPage = getCurrentPage();
    const pageNumber = parseInt(page.textContent!);

    // Evitar recargar la página si ya está seleccionada
    if (currentPage === pageNumber) return;

    // Actualizar la página seleccionada
    selectPaginatorPage(pageNumber);
    dispatchPaginatorEvent(pageNumber);
    handleInit();
  }

  function handleNavigation(to: "next" | "prev") {
    const currentPage = getCurrentPage();
    const nextPage = to === "next" ? currentPage + 1 : currentPage - 1;

    // Evitar navegar a una página inválida
    if (nextPage < 1 || nextPage > getPaginator().length) {
      if (nextPage > getPaginator().length) {
        const nav = document.querySelector("#paginator__container")!;
        nav.setAttribute("data-current", String(getCurrentPage() + 1));
        createNavPaginator();
      }
    }

    selectPaginatorPage(nextPage);
    dispatchPaginatorEvent(nextPage);
    handleInit();
  }

  /**
   * @description Dispara un evento personalizado para navegar a una página específica
   * @param page El número de página a la que se quiere navegar
   * @param popState Indica si el evento fue disparado por el botón de navegación del navegador
   */
  function dispatchPaginatorEvent(page: number, popState = false) {
    const paginatorEvent = new CustomEvent("paginate", {
      bubbles: false,
      cancelable: true,
      detail: { page, popState }
    });
    document.dispatchEvent(paginatorEvent);
  }

  function getCurrentPage() {
    return parseInt(new URL(location.href).searchParams.get("page") || "1");
  }

  function getPageInfo() {
    const nav = document.querySelector("#paginator__container")!;
    return {
      currentPage: parseInt(nav.getAttribute("data-current")!, 10),
      totalPages: parseInt(nav.getAttribute("data-total")!, 10)
    };
  }
});
