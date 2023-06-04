<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import useImageData from "@/use/imageData";
const { initClearImageData } = useImageData();
const isOpenModal = ref(false);
const error = ref({ statusCode: null, statusMessage: null });

const closeErrorModal = () => {
  isOpenModal.value = false;
  document.location.reload();
};

onErrorCaptured((err) => {
  isOpenModal.value = true;
  error.value = {
    statusCode: err.statusCode,
    statusMessage: err.statusMessage || err.stack,
  };
  return false;
});
</script>

<template>
  <NuxtPage />
  <Modal :open="isOpenModal" class="error">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <ui-button text="Go back" blue @click="closeErrorModal" />
  </Modal>
</template>

<style lang="scss">
.error {
  .window {
    @include text-body;
    width: unset !important;
    height: unset !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 12rem;
    .button {
      margin-top: 12rem;
      width: max-content;
    }
  }
}
</style>
