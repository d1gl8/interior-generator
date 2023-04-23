<template>
  <span class="loading-spinner" />
</template>

<style lang="scss" scoped>
.loading-spinner {
  display: block;
  border: 10rem solid var(--color-input);
  border-radius: 50%;
  border-top: 10rem solid var(--color-bright);
  width: 100rem;
  height: 100rem;
  animation: spinner 4s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
