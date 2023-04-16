<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "button",
  },
  icon: {
    type: String,
    required: false,
  },
  blue: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button :class="['button', { blue: props.blue }]">
    <in-svg v-if="props.icon" :src="icon" />
    <span class="text">{{ text }}</span>
  </button>
</template>

<style lang="scss" scoped>
.button {
  @include text-body;
  @include shadow;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: var(--color-secondary-button);
  border-radius: 10rem;
  padding: 12rem 20rem 14rem;
  cursor: pointer;
  svg {
    width: 24rem;
    height: 24rem;
    margin-right: 8rem;
  }
  &.blue {
    color: var(--color-bright);
    background: var(--color-main-button);
  }
}
</style>
