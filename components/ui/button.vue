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
  green: {
    type: Boolean,
    default: false,
  },
  greenGradient: {
    type: Boolean,
    default: false,
  },
  blue: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    :class="[
      'button',
      { blue: props.blue },
      { green: props.green },
      { greenGradient: props.greenGradient },
    ]"
  >
    <in-svg v-if="props.icon" :src="icon" />
    <span class="text">{{ text }}</span>
  </button>
</template>

<style lang="scss">
.button {
  @include text-body;
  @include shadow;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: var(--color-secondary-button);
  border-radius: 8rem;
  padding: 12rem 20rem 14rem;
  svg {
    width: 24rem;
    height: 24rem;
    margin-right: 8rem;
  }
  &.green {
    color: var(--color-bright);
    background: var(--color-main-button);
    box-shadow: 0px 2px 0px 0px #3f800c;
  }
  &.greenGradient {
    background: var(
      --color-share,
      linear-gradient(225deg, #f5f5f5 0%, #ebffe1 100%)
    );
  }
  &.blue {
    background: var(
      --color-upload,
      linear-gradient(225deg, #f5f5f5 0%, #ddecff 100%)
    );
  }
  &:not(:disabled) {
    cursor: pointer;
  }
  &:disabled {
    opacity: 0.3;
  }
}
</style>
