// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  env: {
    schema: {
      TURSO_DATABASE_URL: envField.string({
        optional: false,
        context: "server",
        access: "secret",
        url: true,
      }),
      TURSO_AUTH_TOKEN: envField.string({
        optional: false,
        context: "server",
        access: "secret",
      }),
    }
  },
  output: "server"
});
