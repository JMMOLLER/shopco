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

    if (content.style.maxHeight && content.style.maxHeight !== "0px") {
      el.className = "";
      content.style.maxHeight = "0";
      icon.style.transform = "rotate(0deg)";
    } else {
      el.className = "border-b border-slate-200 pb-2";
      content.style.maxHeight = content.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
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

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
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
            <div data-accordion onClick={handleToggleAccordion}>
              <button className="flex justify-between gap-1 items-center text-slate-800">
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
                  <a aria-label="Ir a Item 1" className="text-nowrap" href="/">
                    Item 1
                  </a>
                </li>
                <li>
                  <a aria-label="Ir a Item 2" className="text-nowrap" href="/">
                    Item 2
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a href="/">On Sale</a>
          </li>
          <li>
            <a href="/">New Arrivals</a>
          </li>
          <li>
            <a href="/">Brands</a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default MobileNav;
