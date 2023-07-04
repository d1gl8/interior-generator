<script setup lang="ts">
import { ref } from "vue";
import useFiles from "@/use/files";
const { readFile, sendFile } = useFiles();

const config = useRuntimeConfig();

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["loading", "loaded"]);

const uploadImg = async (e: DragEvent) => {
  console.log("uploadImg start");
  emits("loading", true);

  let inputFile;
  e.dataTransfer
    ? (inputFile = e.dataTransfer.files[0])
    : (inputFile = e.target?.files[0]);
  if (!inputFile) {
    emits("loading", false);
    return;
  }

  const toSendFormData = new FormData();
  toSendFormData.append("file", inputFile);

  const requestFormData = await sendFile(toSendFormData, "cleaner/image");
  const input = await readFile(inputFile, "url");

  const { crops, output, width, height } =
    requestFormData.value as cleanerImage;

  crops.forEach((crop: crop) => {
    crop.visible = true;
  });

  emits("loaded", {
    input,
    output,
    width,
    height,
    crops,
  });

  emits("loading", false);
  e.target.value = null;
  console.log("uploadImg end");
};
</script>

<template>
  <ui-input-file
    v-show="!isLoading"
    ref="input"
    id="image-to-clean"
    text="Upload image"
    icon="/img/icon/upload.svg"
    @change="uploadImg"
  />
  <lazy-in-svg v-if="isLoading" class="spinner" src="/img/icon/spinner.svg" />
</template>

<style lang="scss">
.upload {
  .spinner {
    @include spinner;
  }
}
</style>
