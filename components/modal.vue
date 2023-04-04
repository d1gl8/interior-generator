<script setup lang="ts">
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div :class="open ? 'modal show' : 'modal'">
    <div class="window">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.modal {
  display: none;
  z-index: 90;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  .window {
    z-index: 91;
    position: relative;
    width: 617rem;
    height: 420rem;
    background-color: var(--white);
    border-radius: 18rem;
    padding: 21rem 23rem;
    &::after {
      content: "";
      position: absolute;
      left: 23rem;
      right: 23rem;
      top: 21rem;
      bottom: 21rem;
      border: 1px solid var(--light-gray-3);
      border-radius: inherit;
    }

    & > * {
      position: relative;
      z-index: 99;
    }
  }
  &.show {
    display: grid;
    place-items: center;
  }
}
</style>
