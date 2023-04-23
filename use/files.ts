export default function useFiles() {
  const sendFile = async (data: FormData, endpoint: String) => {
    const options = {
      headers: {},
      method: "POST",
      body: data,
    };
    const request = await fetch(
      `${useRuntimeConfig().apiPath}${endpoint}`,
      // `http://localhost:3001/post`,
      options
    );

    return request;
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
  };

  const getFileFromUrl = async (url: URL, name: string, type: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new File([blob], name, { type: type });
  };

  return { sendFile, readFile, saveFileFromURL, getFileFromUrl };
}
