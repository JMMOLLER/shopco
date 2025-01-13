interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  onPageChange?: (currentPage: number) => void;
}

function Paginator(props: PaginatorProps) {
  const { currentPage, totalPages, maxVisiblePages = 7 } = props;

  // Función para generar el rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Si el total de páginas es menor o igual al máximo visible, muestra todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (maxVisiblePages % 2 === 0) {
        end -= 1;
      }

      if (start <= 1) {
        start = 1;
        end = maxVisiblePages - 2;
        for (let i = 1; i <= end + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (end >= totalPages) {
        start = totalPages - (maxVisiblePages - 2);
        end = totalPages;
        pages.push(1);
        pages.push("...");
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <footer className="col-span-2 col-start-2 row-start-5">
      <hr className="mt-8" />
      <div className="inline-flex w-full items-center mt-5">
        {/* Botón Anterior */}
        <button
          className="py-2 px-4 border rounded-lg inline-flex gap-x-2 items-center h-fit"
          onClick={() =>
            props.onPageChange && props.onPageChange(currentPage - 1)
          }
          type="button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8332 6.99996H1.1665M1.1665 6.99996L6.99984 12.8333M1.1665 6.99996L6.99984 1.16663"
              stroke="black"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          Previous
        </button>

        {/* Botones de Páginas */}
        <div className="join mx-auto">
          {pages.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => props.onPageChange && props.onPageChange(page)}
                className={`join-item btn ${
                  currentPage === page ? "active" : ""
                }`}
                aria-label={`Pagina ${page}`}
              >
                {page}
              </button>
            ) : (
              <button
                key={index}
                className="join-item btn btn-disabled cursor-default"
                disabled
                aria-label="Páginas omitidas"
              >
                ...
              </button>
            )
          )}
        </div>

        {/* Botón Siguiente */}
        <button
          className="py-2 px-4 border rounded-lg inline-flex gap-x-2 items-center h-fit"
          onClick={() =>
            props.onPageChange && props.onPageChange(currentPage + 1)
          }
          type="button"
        >
          Next
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 6.99996H12.8332M12.8332 6.99996L6.99984 1.16663M12.8332 6.99996L6.99984 12.8333"
              stroke="black"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default Paginator;
