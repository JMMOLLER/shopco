// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import node from "@astrojs/node";

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
      }),
      REDIS_NAME: envField.string({
        optional: true,
        context: 'server',
        access: 'secret',
        default: 'node-server'
      }),
      REDIS_USER: envField.string({
        optional: true,
        context: 'server',
        access: 'secret'
      }),
      REDIS_PASSWORD: envField.string({
        optional: true,
        context: 'server',
        access: 'secret'
      }),
      REDIS_SOCKET_HOST: envField.string({
        optional: true,
        context: 'server',
        access: 'secret'
      }),
      REDIS_SOCKET_PORT:envField.number({
        optional: true,
        context: 'server',
        access: 'secret'
      })
    }
  },
  output: "server"
});
