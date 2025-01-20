import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "astro:env/server";
import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN
});

export default drizzle(turso);
