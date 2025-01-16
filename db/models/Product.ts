import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { decimal } from "@db/types";
import { sql } from "drizzle-orm";

const productTable = sqliteTable("product", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`(uuid7())`),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  rating: integer("rating", { mode: "number" }).notNull().default(0),
  discount: integer("discount"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export default productTable;
