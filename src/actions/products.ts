import db from "@db/index";
import { z } from "astro/zod";
import Product from "@models/Product";
import CardProduct from "@components/Products/CardProduct.astro";
import { ActionError, defineAction } from "astro:actions";
import { experimental_AstroContainer } from "astro/container";
import { count, sql } from "drizzle-orm";


export const products = {
  getProducts: defineAction({
    accept: "json",
    input: z.object({
      page: z.number().optional().default(1),
      size: z.number().optional().default(10)
    }),
    handler: async (input, context) => {
      try {
        // Obtener los productos paginados
        const data = await db
          .select()
          .from(Product)
          .limit(input.size)
          .offset((input.page - 1) * input.size)
          .all();

        // Obtener el total de productos
        const result = await Promise.allSettled(
          data.map(async (product, index) => {
            const container = await experimental_AstroContainer.create();
            return await container.renderToString(CardProduct, {
              props: {
                ...product,
                className: "mt-4 w-fit mx-auto",
                loading: index < 8 ? "eager" : "lazy",
                imgStyle: `view-transition-name: img-transition-${product.id}`,
              },
            });
          })
        ).then((results) =>
          results.map((result) =>
            result.status === "fulfilled" ? result.value : null
          )
        );
        // Verificar si hubo algún error al renderizar los productos
        if (result.includes(null)) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to render products"
          });
        }

        // Calcular el número total de páginas
        const total = await db.select({ count: count() }).from(Product);
        // Calcular el número total de páginas
        const totalPages = Math.ceil(total[0].count / input.size);

        return {
          html: result.join(""),
          total: total[0].count,
          currentPage: input.page,
          totalPages
        };
      } catch (error) {
        console.log(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to render products"
        });
      }
    }
  }),
  getProductById: defineAction({
    accept: "json",
    input: z.object({
      id: z.string()
    }),
    handler: async (input, context) => {
      try {
        const product = await db
          .select()
          .from(Product)
          .where(sql`id = ${input.id}`).get();

        if (!product) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Product not found"
          });
        }

        return product;
      } catch (error) {
        console.log(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get product"
        });
      }
    }
  })
};
