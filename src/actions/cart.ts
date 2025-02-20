import { ActionError, defineAction, isActionError } from "astro:actions";
import ProductDetailsModel from "@models/ProductDetails";
import CartModel, { type CartType } from "@models/Cart";
import ProductModel from "@models/Product";
import { eq } from "drizzle-orm";
import { z } from "astro/zod";
import db from "@db/index";

export const cart = {
  /**
   * @summary Agrega un producto al carrito del usuario autenticado o actualiza la cantidad
   */
  putProductInCart: defineAction({
    accept: "json",
    input: z.object({
      userId: z.string(),
      productDetailId: z.string(),
      quantity: z.number().int().positive(),
      /**
       * @summary Indica si el valor de `quantity` debe ser sumado al valor actual en el carrito
       */
      increase: z.boolean().default(false)
    }),
    handler: async (input, context) => {
      try {
        // Obtener el ID de la sesión del usuario
        const sessionId = context.locals.session?.id;
        if (!sessionId) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "You must be authenticated to perform this action"
          });
        }

        let result: CartType | null = null;

        const join = await db
          .select()
          .from(CartModel)
          .where(eq(CartModel.productDetailId, input.productDetailId))
          .innerJoin(
            ProductDetailsModel,
            eq(CartModel.productDetailId, ProductDetailsModel.id)
          )
          .get();

        if (join) {
          // Se calcula la cantidad total dependiendo de si se está aumentando o estableciendo la cantidad
          const totalQuantity = input.increase
            ? join.cart.quantity + input.quantity
            : input.quantity;

          if (totalQuantity > join.product_details.stock) {
            throw new ActionError({
              code: "CONFLICT",
              message: "Not enough stock available"
            });
          }

          await db
            .update(CartModel)
            .set({ quantity: totalQuantity })
            .where(eq(CartModel.productDetailId, input.productDetailId))
            .execute();
          result = join.cart;
        } else {
          [result] = await db.insert(CartModel).values(input).returning();
        }

        return join;
      } catch (error) {
        console.error(error);
        if (isActionError(error)) throw error;
        else {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to add product to cart"
          });
        }
      }
    }
  }),
  /**
   * @summary Obtiene el carrito del usuario autenticado
   */
  getCart: defineAction({
    accept: "json",
    handler: async (input, context) => {
      try {
        // Obtener el ID de la sesión del usuario
        const sessionId = context.locals.session?.id;
        if (!sessionId) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "You must be authenticated to perform this action"
          });
        }

        const join = await db
          .select()
          .from(CartModel)
          .innerJoin(
            ProductDetailsModel,
            eq(CartModel.productDetailId, ProductDetailsModel.id)
          )
          .innerJoin(
            ProductModel,
            eq(ProductModel.id, ProductDetailsModel.productId)
          )
          .all();

        return join;
      } catch (error) {
        console.error(error);
        if (isActionError(error)) throw error;
        else {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to add product to cart"
          });
        }
      }
    }
  }),
  /**
   * @summary Elimina un producto del carrito del usuario autenticado
   */
  deleteFromCart: defineAction({
    accept: "json",
    input: z.object({
      productDetailId: z.string()
    }),
    handler: async (input, context) => {
      try {
        // Obtener el ID de la sesión del usuario
        const sessionId = context.locals.session?.id;
        if (!sessionId) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "You must be authenticated to perform this action"
          });
        }

        await db
          .delete(CartModel)
          .where(eq(CartModel.productDetailId, input.productDetailId))
          .execute();

        return true;
      } catch (error) {
        console.error(error);
        if (isActionError(error)) throw error;
        else {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to add product to cart"
          });
        }
      }
    }
  })
};
