import type { APIContext } from "astro";
import { db, Product } from "astro:db";

export async function GET(context: APIContext): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);
  const currentPage = parseInt(url.searchParams.get("page") || "1", 10);
  const sizePages = parseInt(url.searchParams.get("size") || "10", 10);
  const offset = (currentPage - 1) * sizePages;

  // Obtener los productos paginados
  const products = await db
    .select()
    .from(Product)
    .limit(sizePages)
    .offset(offset)
    .all();

  // Obtener el total de productos
  const totalResult = (await db.select().from(Product)).length;
  const total = totalResult || 0;

  // Calcular el número total de páginas
  const totalPages = Math.ceil(total / sizePages);

  return new Response(
    JSON.stringify({
      products,
      total,
      currentPage,
      totalPages
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
