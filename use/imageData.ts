export default function useImageData() {
  let imageData = ref({});
  const initClearImageData = () => {
    imageData.value = {
      state: 0,
      isGetted: false,
      input: null,
      output: {
        image: null,
        size: null,
      },
      crops: null,
    };
  };

  return { imageData, initClearImageData };
}
