import { UseFetchOptions } from "nuxt/dist/app/composables";

export default function useFiles() {
  const config = useRuntimeConfig();

  const useApiFetch = (url: string, options: UseFetchOptions<object> = {}) => {
    options.baseURL = `${config.apiBaseUrl}/api`;
    return useFetch(url, {
      ...options,
      async onResponse({ request, response, options }) {},
      async onResponseError({ request, response, options }) {
        console.log("[fetch response error]");
      },

      async onRequest({ request, options }) {
        const headers = new Headers(options.headers);
        headers.set("request-start", Date.now().toString());
        if (process.client) {
          const sessionObject = await useSession();
          headers.set("session", sessionObject.session.value.id);
        }
        options.headers = headers;
      },

      async onRequestError({ request, options, error }) {
        console.log("[fetch request error]");
      },
    });
  };

  const sendFile = async (sendData: FormData, endpoint: string) => {
    let options = {
      method: "POST",
      body: sendData,
    };

    const { data, error } = await useApiFetch(endpoint, options);
    if (error.value) {
      throw createError(error.value);
    }
    return data;
  };

  const readFile = (file: File, as = "text") => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      if (as === "text") reader.readAsText(file);
      if (as === "url") reader.readAsDataURL(file);
    });
  };

  const saveFileFromURL = (fileURL: string, name: string = "file-name") => {
    let downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = fileURL;
    downloadLink.target = "_self";
    downloadLink.download = name;
    downloadLink.click();
    downloadLink.remove();
  };

  const getFileFromUrl = async (url: URL, name: string, type: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new File([blob], name, { type: type });
  };

  return { sendFile, readFile, saveFileFromURL, getFileFromUrl };
}
