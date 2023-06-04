import { i18n } from "./locales/config";
export default defineNuxtConfig({
  ssr: false,
  app: {
    rootId: "artixel",
    head: {
      charset: "utf-8",
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  runtimeConfig: {
    public: {
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
  nitro: {
    compressPublicAssets: true,
  },
  modules: [
    ["@nuxtjs/i18n", i18n],
    [
      "@sidebase/nuxt-session",
      {
        isEnabled: true,
        ipPinning: true,
        rolling: true,
        session: {
          expiryInSeconds: 60 * 60,
          idLength: 16,
          cookieSecure: false,
          cookieHttpOnly: false,
        },
        api: {
          basePath: "/client/session",
        },
      },
    ],
    [
      "nuxt-gtag",
      {
        id: process.env.NUXT_PUBLIC_GTAG_ID,
        loadingStrategy: "async",
      },
    ],
  ],
});
