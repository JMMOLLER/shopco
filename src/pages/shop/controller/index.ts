import type { AstroGlobal } from "astro";
import { actions } from "astro:actions";

export async function loadShopData(Astro: AstroGlobal) {
  const suitStyle = Astro.params.category as SuitStyleType[number] | undefined;
  const currentPage = parseInt(Astro.url.searchParams.get("page") || "1");

  const userAgent = Astro.request.headers.get("user-agent") || "";
  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

  const defaultSize = isMobile ? 6 : 20;
  const size = parseInt(
    Astro.url.searchParams.get("size") || defaultSize.toString()
  );

  const result = await Astro.callAction(actions.getProducts, {
    page: currentPage,
    suitStyle,
    size
  });

  if (!result || result.error) {
    return { redirect: "/404" };
  } else if (result.data.totalPages < currentPage) {
    const url = new URL(Astro.url.href);
    url.searchParams.set("page", result.data.totalPages.toString());
    return { redirect: url.toString() };
  }

  const { html, total, ...pagination } = result.data;

  return {
    currentPage,
    pagination,
    total,
    html
  };
}
