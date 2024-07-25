import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import mkcert from "vite-plugin-mkcert";
import { loadEnv } from "vite";

const { RUNNING_LOCALLY, STORYBLOK_ACESS_TOKEN, STORYBLOK_IS_PREVIEW } =
  loadEnv(process.env.NODE_ENV, process.cwd(), "");
const isLocal = RUNNING_LOCALLY === "yes";
const isPreview = STORYBLOK_IS_PREVIEW === "yes";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    plugins: [...(isLocal && [mkcert()])],
  },
});
