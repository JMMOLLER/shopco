// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import node from "@astrojs/node";

console.log(process.env.NODE_ENV);

const adapter =
  process.env.NODE_ENV === "production"
    ? vercel()
    : node({
        mode: "standalone"
      });

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  adapter,
  env: {
    schema: {
      TURSO_DATABASE_URL: envField.string({
        optional: false,
        context: "server",
        access: "secret",
        url: true
      }),
      TURSO_AUTH_TOKEN: envField.string({
        optional: false,
        context: "server",
        access: "secret"
      })
    }
  },
  output: "server"
});
