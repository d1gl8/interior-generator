<script setup lang="ts">
import { ref } from "vue";
import useFiles from "@/use/files";
const { readFile, sendFile } = useFiles();

const config = useRuntimeConfig();
const input = ref(null);

// const loading = ref(false);

const props = defineProps({
  imageData: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["loading", "loaded"]);

const resetData = () => {
  emits("loaded", {
    input: null,
    output: {
      image: null,
      size: null,
    },
    crops: null,
  });
};

const uploadImg = async (e: Event) => {
  emits("loading", true);
  console.clear();

  let imageForRemover;
  e.dataTransfer
    ? (imageForRemover = e.dataTransfer.files[0])
    : (imageForRemover = e.target?.files[0]);
  if (!imageForRemover) {
    emits("loading", false);
    return;
  }

  const input = await readFile(imageForRemover, "url");

  const toSendFormData = new FormData();
  toSendFormData.append("file", imageForRemover);

  const requestFormData = await sendFile(toSendFormData, "cleaner/image");
  console.log(requestFormData);

  const { crops, width, height } = requestFormData.value;
  const image = requestFormData.value.output;
  const size = { width, height };

  emits("loaded", {
    state: 1,
    isGetted: true,
    input,
    output: {
      image,
      size,
    },
    crops,
  });

  emits("loading", false);
  e.target.value = null;
};
</script>

<template>
  <div class="artixel-upload">
    <ui-input-file
      v-show="!imageData.loading"
      ref="input"
      id="image-to-clean"
      text="Upload image"
      icon="/img/icon/upload.svg"
      @change="uploadImg"
    />
    <lazy-in-svg
      v-if="imageData.loading"
      class="spinner"
      src="/img/icon/spinner.svg"
    />
  </div>
</template>

<style lang="scss">
.artixel-upload {
  grid-area: "upload";
  margin: 0 auto;
  .spinner {
    @include spinner;
  }
  @include tablet {
    width: 100%;
    height: 400rem;
    display: grid;
    place-items: center;
    border: 4rem dashed var(--color-placeholder);
    border-radius: 10rem;
  }
}
</style>
