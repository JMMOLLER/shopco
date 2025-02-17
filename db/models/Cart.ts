import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import ProductDetailsModel from "./ProductDetails";
import { sql } from "drizzle-orm";
import UserModel from "./Users";

const CartModel = sqliteTable("cart", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`(uuid7())`),
  productDetailId: text("product_detail_id")
    .notNull()
    .references(() => ProductDetailsModel.id),
  userId: text("user_id")
    .notNull()
    .references(() => UserModel.id),
  quantity: integer("quantity").notNull().default(1),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export type CartType = typeof CartModel.$inferInsert;

export default CartModel;
