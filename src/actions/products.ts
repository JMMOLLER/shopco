import db from "@db/index";
import { z } from "astro/zod";
import ProductModel from "@models/Product";
import CardProduct from "@components/Products/CardProduct.astro";
import { ActionError, defineAction } from "astro:actions";
import { experimental_AstroContainer } from "astro/container";
import ProductDetailsModel from "@models/ProductDetails";
import { count, eq, inArray, like, or, sql } from "drizzle-orm";
import { RedisConnection } from "@db/redis";
import suitStyles from "@utils/suitStyles";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const products = {
  getProducts: defineAction({
    accept: "json",
    input: z.object({
      page: z.number().optional().default(1),
      size: z.number().optional().default(10),
      suitStyle: z
        .enum<string, ["casual", "formal", "gym", "party"]>(suitStyles as any)
        .optional()
    }),
    handler: async (input, context) => {
      try {
        // Obtener el cliente de Redis para verificar si hay datos en caché
        const client = RedisConnection.getInstance().getClient();

        try {
          const cached = await client.get(
            `${input.suitStyle || "all"}-products-page:${input.page}-size:${
              input.size
            }`
          );
          if (cached) {
            console.log(
              "\x1b[36m%s\x1b[0m",
              `{Page [${input.page}] | Size [${input.size}]} loaded from cache`
            );
            return JSON.parse(cached);
          }
        } catch (error) {
          console.error(error);
        }

        // Crear una consulta para obtener los productos
        const query = db
          .select()
          .from(ProductModel)
          .limit(input.size)
          .offset((input.page - 1) * input.size);

        const buildSuitStyleFilter = (
          suitStyleModel: SQLiteColumn,
          suitStyle: (typeof suitStyles)[number]
        ) => {
          return or(
            eq(suitStyleModel, suitStyle),
            like(suitStyleModel, `${suitStyle},%`),
            like(suitStyleModel, `%,${suitStyle}`),
            like(suitStyleModel, `%,${suitStyle},%`)
          );
        };

        // Filtrar los productos por estilo
        if (input.suitStyle) {
          query.where(
            buildSuitStyleFilter(ProductModel.suitStyle, input.suitStyle)
          );
        }

        // Obtener los productos paginados
        const data = await query.all();

        // Obtener el total de productos
        const htmlResult = await Promise.allSettled(
          data.map(async (product, index) => {
            const container = await experimental_AstroContainer.create();
            return await container.renderToString(CardProduct, {
              props: {
                ...product,
                className: "mt-4 w-fit mx-auto",
                loading: index < 8 ? "eager" : "lazy",
                imgStyle: `view-transition-name: img-transition-${product.id}`
              }
            });
          })
        ).then((results) =>
          results.map((result) =>
            result.status === "fulfilled" ? result.value : null
          )
        );
        // Verificar si hubo algún error al renderizar los productos
        if (htmlResult.includes(null)) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to render products"
          });
        }

        // Calcular el número total de páginas
        const queryTotal = db.select({ count: count() }).from(ProductModel);

        if (input.suitStyle) {
          queryTotal.where(
            buildSuitStyleFilter(ProductModel.suitStyle, input.suitStyle)
          );
        }
        const total = await queryTotal.all();
        // Calcular el número total de páginas
        const totalPages = Math.ceil(total[0].count / input.size);

        const result = {
          html: htmlResult.join(""),
          total: total[0].count,
          currentPage: input.page,
          totalPages
        };

        client.isOpen &&
          client.set(
            `${input.suitStyle || "all"}-products-page:${input.page}-size:${
              input.size
            }`,
            JSON.stringify(result),
            {
              EX: 60 * 60 * 24 // 24 horas
            }
          );

        return result;
      } catch (error) {
        console.error(error);
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
        // Obtener el cliente de Redis para verificar si hay datos en caché
        const client = RedisConnection.getInstance().getClient();

        try {
          const cached = await client.get(`product:${input.id}`);
          if (cached) {
            console.info(
              "\x1b[36m%s\x1b[0m",
              `Product [${input.id}] loaded from cache`
            );
            return JSON.parse(cached);
          }
        } catch (error) {
          console.error(error);
        }

        const product = await db
          .select()
          .from(ProductModel)
          .where(sql`id = ${input.id}`)
          .get();

        if (!product) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Product not found"
          });
        }

        const product_details = await db
          .select()
          .from(ProductDetailsModel)
          .where(sql`product_id = ${input.id}`)
          .all();

        // Crear un objeto con los detalles del producto
        const result = { ...product, inventory: product_details };

        // Guardar el producto en caché
        client.isOpen &&
          client.set(`product:${input.id}`, JSON.stringify(result), {
            EX: 60 * 60 * 24 // 24 horas
          });

        return result;
      } catch (error) {
        console.error(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get product"
        });
      }
    }
  }),
  getProductDetailById: defineAction({
    accept: "json",
    input: z.object({
      id: z.string()
    }),
    handler: async (input, context) => {
      try {
        const product = await db
          .select()
          .from(ProductDetailsModel)
          .where(sql`id = ${input.id}`)
          .get();

        if (!product) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Product detail not found"
          });
        }

        return product;
      } catch (error) {
        console.error(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get product detail"
        });
      }
    }
  }),
  getProductsInfo: defineAction({
    accept: "json",
    input: z.object({
      ids: z.array(z.string())
    }),
    handler: async (input, context) => {
      try {
        const products = await db
          .select()
          .from(ProductModel)
          .where(inArray(ProductModel.id, input.ids))
          .all();

        return products;
      } catch (error) {
        console.error(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get products info"
        });
      }
    }
  })
};
