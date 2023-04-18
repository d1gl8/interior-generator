export default function useFiles() {
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

    return await request.formData();
  };

  return { readFile, sendFile };
}
