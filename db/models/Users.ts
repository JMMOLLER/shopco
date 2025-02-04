import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const UserModel = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .default(sql`(uuid7())`),
  name: text("name").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export type UserType = typeof UserModel.$inferInsert;

export default UserModel;
