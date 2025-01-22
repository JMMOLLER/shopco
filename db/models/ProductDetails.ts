import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import ProductModel from "./Product";
import { sql } from "drizzle-orm";
import { size } from "@db/types";

const ProductDetailsModel = sqliteTable("product_details", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`(uuid7())`),
  productId: text("product_id")
    .notNull()
    .references(() => ProductModel.id),
  size: size("size").notNull(),
  color: text("color").notNull(),
  stock: integer("stock").notNull().default(0)
});

export type ProductDetailType = typeof ProductDetailsModel.$inferInsert;

export default ProductDetailsModel;
