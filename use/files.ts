export default function useFiles() {
  const config = useRuntimeConfig();
  const sendFile = async (data: FormData, endpoint: string) => {
    const { session } = await useSession();
    const options = {
      headers: {
        session: session.value?.id,
      },
      method: "POST",
      body: data,
    };

    try {
      const request = await useFetch(
        `${config.apiBaseUrl}/api/${endpoint}`,
        options
      );

      return request;
    } catch (err) {
      console.log(err);
    }
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
