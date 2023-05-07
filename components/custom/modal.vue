<script setup lang="ts">
import { watch, nextTick } from "vue";
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["modalClose"]);

const modal = ref(null);

const notModalClick = (e: Event) => {
  if (e.target?.classList.value.includes("modal show")) emits("modalClose");
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) window.addEventListener("click", notModalClick);
    else window.removeEventListener("click", notModalClick);
  }
);
</script>

<template>
  <div :class="open ? 'modal show' : 'modal'">
    <div ref="modal" class="window">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.modal {
  display: none;
  z-index: 91;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  .window {
    z-index: 92;
    position: relative;
    width: 438rem;
    height: 408rem;
    background-color: var(--color-bright);
    border-radius: 20rem;
    padding: 28rem 40rem 40rem;

    & > *:not(svg) {
      position: relative;
      z-index: 93;
    }
  }
  &.show {
    display: grid;
    place-items: center;
  }
}
</style>
