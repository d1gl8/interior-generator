<template>
  <span class="loading-spinner" />
</template>

<style lang="scss" scoped>
.loading-spinner {
  margin: auto;
  border: 10rem solid var(--light-blue-2);
  border-radius: 50%;
  border-top: 10rem solid var(--blue);
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
