<script setup lang="ts">
import { ref } from "vue";
import useFiles from "@/use/files";
const { readFile, sendFile } = useFiles();

const input = ref(null);

const loading = ref(false);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["loaded"]);

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
  loading.value = true;
  console.clear();

  // const back = await fetch(`http://localhost:3010/`);
  // console.log(await back.json());

  let imageForRemover;
  e.dataTransfer
    ? (imageForRemover = e.dataTransfer.files[0])
    : (imageForRemover = e.target?.files[0]);
  if (!imageForRemover) {
    loading.value = false;
    return;
  }
  resetData();

  const input = await readFile(imageForRemover, "url");

  const toSendFormData = new FormData();
  toSendFormData.append("file", imageForRemover);
  const requestFormData = await sendFile(toSendFormData, "/api/predict");
  const responseFormData = await requestFormData.formData();

  const image = await readFile(responseFormData.get("output"), "url");

  const { crops, size } = JSON.parse(
    await readFile(responseFormData.get("locations"))
  );
  for (const entry of responseFormData.entries()) {
    const key = entry[0];
    const value = entry[1];
    if (key.includes("rgb")) {
      const id = +key.substring(key.indexOf("_") + 1, key.length);
      const crop = crops.find((crop) => crop.index === id);
      if (key.includes("rgb_")) crop.rgb = await readFile(value, "url");
      if (key.includes("rgba_")) crop.rgba = await readFile(value, "url");
      crop.visible = false;
    }
  }

  emits("loaded", {
    isGetted: true,
    input,
    output: {
      image,
      size,
    },
    crops,
  });

  loading.value = false;
};
</script>

<template>
  <main class="module-upload">
    <ui-input-file
      v-show="!loading"
      ref="input"
      id="image-to-remove"
      text="Upload image"
      icon="/img/icon/upload.svg"
      @change="uploadImg"
    />
    <lazy-in-svg v-if="loading" class="spinner" src="/img/icon/spinner.svg" />
  </main>
</template>

<style lang="scss">
.module-upload {
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
    margin-bottom: 40rem;
  }
}
</style>
