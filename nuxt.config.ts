import fs from "fs";
const isDev = process.env.NODE_ENV !== "production";

import { i18n } from "./locales/config";
export default defineNuxtConfig({
  devServer: {
    https: {
      key: fs.readFileSync("./localhost.key").toString(),
      cert: fs.readFileSync("./localhost.crt").toString(),
    },
  },
  runtimeConfig: {
    public: {
      isDev,
      apiBaseUrl: "", // !@ fallback?
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/ui",
      prefix: "ui",
    },
    {
      path: "~/components/modules",
      prefix: "module",
    },
    {
      path: "~/components/custom",
      pathPrefix: false,
    },
  ],
  telemetry: false,
  css: ["~/assets/styles/base.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_mixins.scss";',
        },
      },
    },
  },
  modules: [["@nuxtjs/i18n", i18n], "@sidebase/nuxt-session"],
});
