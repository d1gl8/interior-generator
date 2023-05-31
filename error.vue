<script setup lang="ts">
defineProps(["error"]);
</script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <ui-button text="Go back" blue @click="clearError" />
  </div>
</template>

<style lang="scss">
.error-page {
  @include text-body;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 12rem;
  .button {
    width: max-content;
  }
}
</style>
