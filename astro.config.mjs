import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mkcert from "vite-plugin-mkcert";
import { loadEnv } from "vite";
import vercel from "@astrojs/vercel/serverless";
import storyblok from "@storyblok/astro";
import db from "@astrojs/db";
const { RUNNING_LOCALLY, STORYBLOK_ACESS_TOKEN } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  ""
);
//This is just for local SSL, dont need this in production
const isLocal = RUNNING_LOCALLY === "yes";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    storyblok({
      accessToken: STORYBLOK_ACESS_TOKEN,
      components: {
        article: "storyblok/Article",
      },
    }),
    db(),
  ],
  vite: {
    plugins: [...(isLocal && [mkcert()])],
  },
  output: "server",
  adapter: vercel(),
  security: {
    checkOrigin: true,
  },
});
