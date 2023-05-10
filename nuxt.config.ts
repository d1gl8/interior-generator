const isDev = process.env.NODE_ENV !== "production";

import { i18n } from "./locales/config";
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      isDev,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
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
