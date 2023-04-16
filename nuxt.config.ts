import { i18n } from "./locales/config";
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiPath: process.env.API_PRODUCTION,
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
  css: ["~/assets/styles/base.scss", "~/assets/styles/base-v2.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_mixins.scss";',
        },
      },
    },
  },
  modules: [["@nuxtjs/i18n", i18n]],
});
