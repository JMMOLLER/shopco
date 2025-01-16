type PageNumbers = {
  totalPages: number;
  currentPage: number;
  maxVisiblePages?: number;
};

// Función para generar el rango de páginas a mostrar
export default function getPageNumbers(props: PageNumbers) {
  const { currentPage, maxVisiblePages = 7, totalPages } = props;
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
}
