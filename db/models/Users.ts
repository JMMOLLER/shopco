import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const UserModel = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`(uuid7())`),
  name: text("name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export type UserType = typeof UserModel.$inferInsert;

export default UserModel;
