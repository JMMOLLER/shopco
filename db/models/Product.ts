import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { category, decimal, suitStyle } from "@db/types";
import { sql } from "drizzle-orm";

const ProductModel = sqliteTable("product", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`(uuid7())`),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  rating: integer("rating", { mode: "number" }).notNull().default(0),
  discount: integer("discount"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: category("category").notNull(),
  suitStyle: suitStyle("suit_style").notNull(),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export type ProductType = typeof ProductModel.$inferInsert;

export default ProductModel;
