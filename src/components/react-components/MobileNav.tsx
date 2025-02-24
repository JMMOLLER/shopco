import { useCallback, useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@assets/chevron-down.svg";
import HamburgerIcon from "@assets/hamburger.svg";
import CloseIcon from "@assets/close.svg";

type SvgIcon = {
  chevronDown: string | null;
  hamburger: string | null;
  close: string | null;
};

function MobileNav() {
  // Selecciona el botón y los elementos relevantes
  const dressCategoryRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const onClose = "top-0 animate-fade-out-down".split(" ");
  const onOpen = "top-full animate-fade-in-down".split(" ");

  const [svgContent, setSvgContent] = useState<SvgIcon | null>(null);
  const [navIsOpen, setNavIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    // Alterna la visibilidad de los íconos
    if (!navIsOpen) {
      handleToggleNav(true);
    } else {
      handleToggleNav();
      navRef.current!.addEventListener("animationend", handleEndAnimation);
    }

    setNavIsOpen(!navIsOpen);
  }, [navIsOpen]);

  // Función para manejar el final de la animación
  const handleEndAnimation = () => {
    navRef.current!.classList.remove(...onClose);
    navRef.current!.classList.add("!hidden");
    navRef.current!.removeEventListener("animationend", handleEndAnimation);
  };

  // Función para manejar la apertura y cierre del nav
  const handleToggleNav = (isOpen = false) => {
    if (isOpen) {
      navRef.current!.classList.remove("!hidden");
      navRef.current!.classList.remove(...onClose);
      navRef.current!.classList.add(...onOpen);
    } else {
      navRef.current!.classList.add(...onClose);
      navRef.current!.classList.remove(...onOpen);
    }
  };

  // Lógica del acordeón
  const handleToggleAccordion = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const el = e.currentTarget as HTMLElement;
    const content = el.querySelector("[data-content]") as HTMLElement;
    const icon = el.querySelector("[data-icon]") as HTMLElement;
    const firstChild = el.firstElementChild as HTMLElement;

    if (content.style.maxHeight && content.style.maxHeight !== "0px") {
      el.className = "";
      content.style.maxHeight = "0";
      icon.style.transform = "rotate(0deg)";
      firstChild.setAttribute("aria-expanded", "false");
    } else {
      el.className = "border-b border-slate-200 pb-2";
      firstChild.setAttribute("aria-expanded", "true");

      // Calcular el alto total del contenido considerando los acordeones anidados
      const nestedAccordions = content.querySelectorAll("[data-accordion]");
      let totalHeight = content.scrollHeight;
      nestedAccordions.forEach((nestedAccordion) => {
        const nestedContent = nestedAccordion.querySelector(
          "[data-content]"
        ) as HTMLElement;
        totalHeight += nestedContent.scrollHeight;
      });

      content.style.maxHeight = totalHeight + "px";
      icon.style.transform = "rotate(180deg)";
    }

    e.stopPropagation(); // Detener la propagación del evento
  };

  // Logica para cerrar el nav al hacer click fuera de él
  const handleClickOutside = (e: MouseEvent) => {
    if (
      navIsOpen &&
      navRef.current &&
      !navRef.current.contains(e.target as Node) &&
      btnRef.current &&
      !btnRef.current.contains(e.target as Node)
    ) {
      // Cerrar los acordeones abiertos
      [dropdownRef, dressCategoryRef].forEach((ref) => {
        const button = ref.current?.firstChild as HTMLElement;
        if (button?.getAttribute("aria-expanded") === "true") {
          ref.current?.click();
        }
      });
      // Cerrar el nav
      handleToggleNav();
      navRef.current!.addEventListener("animationend", handleEndAnimation);
      setNavIsOpen(false);
    }
  };

  // Listener para cerrar el nav al redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 905 && navIsOpen) {
        // Cerrar el nav
        handleToggleNav();
        navRef.current!.addEventListener("animationend", handleEndAnimation);
        setNavIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navIsOpen, onClose, onOpen]);

  useEffect(() => {
    Promise.allSettled([
      fetch(ChevronDownIcon.src).then((res) => res.text()),
      fetch(HamburgerIcon.src).then((res) => res.text()),
      fetch(CloseIcon.src).then((res) => res.text())
    ])
      .then((res) => {
        const fulfilled = res.filter(
          (r): r is PromiseFulfilledResult<string> => r.status === "fulfilled"
        ); // Filtrar solo las promesas cumplidas
        const [chevronDown, hamburger, close] = fulfilled.map((r) => r.value); // Obtener el valor de la promesa
        setSvgContent({ chevronDown, hamburger, close });
      })
      .catch((err) => console.error("Error loading SVG:", err));
  }, []);

  return (
    <>
      <button
        ref={btnRef}
        className="nav:hidden focus:outline-none p-1 flex items-center justify-center"
        title="Toggle navigation"
        onClick={handleClick}
        type="button"
      >
        <span
          dangerouslySetInnerHTML={{
            __html: !navIsOpen
              ? svgContent?.hamburger || ""
              : svgContent?.close || ""
          }}
        ></span>
      </button>
      <nav
        ref={navRef}
        aria-expanded={navIsOpen}
        aria-hidden={!navIsOpen}
        className="shadow-[1px_20px_20px_0px_rgba(0,0,0,0.25)] bg-mobile-nav-gradient absolute max-md:flex flex-col gap-y-4 items-center text-center left-0 z-20 p-5 rounded-lg w-full opacity-100 !hidden"
      >
        <ul className="flex flex-col gap-y-3 items-center text-center">
          <li>
            <div
              data-accordion
              ref={dropdownRef}
              onClick={handleToggleAccordion}
            >
              <button
                aria-expanded="false"
                className="flex justify-between gap-1 items-center text-slate-800 mx-auto"
              >
                <span>Shop</span>
                <span
                  className="text-slate-800 transition-transform duration-300"
                  dangerouslySetInnerHTML={{
                    __html: svgContent?.chevronDown || ""
                  }}
                  data-icon="true"
                />
              </button>
              <ul
                className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out"
                data-content
              >
                <li>
                  <a
                    aria-label="Ir a Item 1"
                    className="text-nowrap"
                    href="/shop"
                  >
                    All
                  </a>
                </li>
                <li>
                  <div
                    onClick={handleToggleAccordion}
                    ref={dressCategoryRef}
                    data-accordion
                  >
                    <button
                      aria-expanded="false"
                      className="flex justify-between gap-1 items-center text-slate-800"
                    >
                      <span>Dress Styles</span>
                      <span
                        className="text-slate-800 transition-transform duration-300"
                        dangerouslySetInnerHTML={{
                          __html: svgContent?.chevronDown || ""
                        }}
                        data-icon="true"
                      />
                    </button>
                    <ul
                      className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out"
                      data-content
                    >
                      <li>
                        <a href="/shop/casual" aria-label="Go to category">
                          Casual
                        </a>
                      </li>
                      <li>
                        <a href="/shop/formal" aria-label="Go to category">
                          Formal
                        </a>
                      </li>
                      <li>
                        <a href="/shop/party" aria-label="Go to category">
                          Party
                        </a>
                      </li>
                      <li>
                        <a href="/shop/gym" aria-label="Go to category">
                          Gym
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a href="/shop/On%20Sale">On Sale</a>
          </li>
          <li>
            <a href="/shop/New%20Arrivals">New Arrivals</a>
          </li>
          <li>
            <a href="/shop/Brands">Brands</a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default MobileNav;
