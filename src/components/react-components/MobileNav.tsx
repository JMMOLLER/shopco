import { useCallback, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

function MobileNav() {
  // Selecciona el botón y los elementos relevantes
  const btnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const onClose = "top-0 animate-fade-out-down".split(" ");
  const onOpen = "top-full animate-fade-in-down".split(" ");

  const [navIsOpen, setNavIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    // Alterna la visibilidad de los íconos
    if (!navIsOpen) {
      navRef.current!.classList.remove("!hidden");
      navRef.current!.classList.remove(...onClose);
      navRef.current!.classList.add(...onOpen);
    } else {
      navRef.current!.classList.add(...onClose);
      navRef.current!.classList.remove(...onOpen);
      const onEnd = () => {
        console.log("onEnd");
        navRef.current!.classList.remove(...onClose);
        navRef.current!.classList.add("!hidden");
        navRef.current!.removeEventListener("animationend", onEnd);
      };
      navRef.current!.addEventListener("animationend", onEnd);
    }

    setNavIsOpen(!navIsOpen);
  }, [navIsOpen]);

  // lógica del acordeón
  const handleToggleAccordion = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const el = e.currentTarget as HTMLElement;
    const content = el.querySelector("[data-content]") as HTMLElement;
    const icon = el.querySelector("[data-icon]") as HTMLElement;

    // Alterna la visibilidad del contenido
    if (content.style.maxHeight && content.style.maxHeight !== "0px") {
      el.className = "";
      content.style.maxHeight = "0";
      icon.innerHTML = renderToString(<ArrowDown />);
    } else {
      el.className = "border-b border-slate-200 pb-2";
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.rotate = "rotate(180deg)";
      icon.innerHTML = renderToString(<ArrowDown />);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        className="md:hidden focus:outline-none p-1 flex items-center justify-center"
        title="Toggle navigation"
        type="button"
        onClick={handleClick}
      >
        <span>
          {!navIsOpen ? <HamburgerIcon /> : <CloseIcon />}
        </span>
      </button>
      <nav
        ref={navRef}
        className="shadow-[1px_20px_20px_0px_rgba(0,0,0,0.25)] bg-gradient-to-b from-transparent to-white absolute max-md:flex flex-col gap-y-4 items-center text-center left-0 z-10 p-5 rounded-lg w-full opacity-100 !hidden"
      >
        <ul className="flex flex-col gap-y-3 items-center text-center">
          <li>
            <div data-accordion onClick={handleToggleAccordion}>
              <button className="flex justify-between items-center text-slate-800">
                <span>Shop</span>
                <span
                  className="text-slate-800 transition-transform duration-300"
                  data-icon
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
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

const HamburgerIcon = () => (
  <svg width="20" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.375 8a1.125 1.125 0 0 1-1.125 1.125H1.75a1.125 1.125 0 0 1 0-2.25h16.5A1.125 1.125 0 0 1 19.375 8ZM1.75 3.125h16.5a1.125 1.125 0 0 0 0-2.25H1.75a1.125 1.125 0 1 0 0 2.25Zm16.5 9.75H1.75a1.125 1.125 0 1 0 0 2.25h16.5a1.125 1.125 0 1 0 0-2.25Z"
      fill="#000"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="20"
    height="16"
    viewBox="3 3 17 17"
  >
    <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
  </svg>
);
const ArrowDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

export default MobileNav;
