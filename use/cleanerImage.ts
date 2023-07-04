export default function useCleanerImage() {
  let cleanerImage: Ref<cleanerImage> = ref({});
  const initClearCleanerImage = () => {
    cleanerImage.value = {
      // state: false,
      // isGetted: false,
      input: "",
      output: "",
      width: 0,
      height: 0,
      crops: [],
      // loading: false,
    };
  };

  return { cleanerImage, initClearCleanerImage };
}
