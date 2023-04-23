<script setup lang="ts">
const props = defineProps({
  isChecked: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div :class="['checkbox', { checked: isChecked, square }]">
    <in-svg class="back" src="/img/icon/checkbox/background.svg" />
    <in-svg class="thumb" src="/img/icon/checkbox/thumb.svg" />
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  width: 36rem;
  height: 22rem;
  cursor: pointer;
  svg {
    position: absolute;
    &.back {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: var(--color-input);
    }
    &.thumb {
      top: 2rem;
      left: 2rem;
      width: 18rem;
      height: 18rem;
      color: #68747c; // !@
      transition: left 250ms;
    }
  }
  &.checked {
    svg {
      &.back {
        color: var(--color-bright-hover);
      }
      &.thumb {
        color: var(--color-toggle-on);
        left: 16rem;
      }
    }
  }
  &.square {
    width: 24rem;
    height: 24rem;
    background-color: var(--color-bright);
    border-radius: 2rem;
    &.checked {
      &::after {
        content: "";
        position: absolute;
        left: 6rem;
        top: 6rem;
        width: 12rem;
        height: 12rem;
        background-color: var(--color-toggle-on);
        border-radius: 1rem;
      }
    }

    svg {
      display: none;
    }
  }
}
</style>
