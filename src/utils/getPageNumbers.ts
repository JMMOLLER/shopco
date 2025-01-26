type PageNumbers = {
  totalPages: number;
  currentPage: number;
  maxVisiblePages?: number;
};

// Función para generar el rango de páginas a mostrar
export default function getPageNumbers(props: PageNumbers) {
  const { currentPage, maxVisiblePages = 7, totalPages } = props;
  const pages: (number | string)[] = [];

  // Siempre se incluye la primera y la última página
  const visibleCount = maxVisiblePages - 2; // Páginas visibles excluyendo 1 y totalPages
  const half = Math.floor(visibleCount / 2);

  // Si el total de páginas es menor o igual al máximo visible, muestra todas las páginas
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Siempre incluir la primera página
  pages.push(1);

  // Calcular el rango dinámico
  let start = Math.max(2, currentPage - half);
  let end = Math.min(totalPages - 1, currentPage + half);

  // Ajustar si hay un desbalance en el rango (por ejemplo, cuando está al inicio o final)
  if (currentPage <= half + 1) {
    start = 2;
    end = 1 + visibleCount;
  } else if (currentPage >= totalPages - half) {
    end = totalPages - 1;
    start = totalPages - visibleCount;
  }

  // Agregar puntos suspensivos al principio si es necesario
  if (start > 2) {
    pages.push("...");
  }

  // Agregar las páginas visibles dinámicas
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Agregar puntos suspensivos al final si es necesario
  if (end < totalPages - 1) {
    pages.push("...");
  }

  // Siempre incluir la última página
  pages.push(totalPages);

  return pages;
}
