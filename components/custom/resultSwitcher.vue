<script setup lang="ts">
import { computed } from "vue";

defineEmits(["change"]);
const props = defineProps({
  state: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
  <div class="result-switcher">
    <label for="before" class="before" @click="$emit('change', 0)">
      <input type="radio" name="before-after" id="before" :checked="!state" />
      <span class="text">Before</span>
    </label>
    <label for="after" class="after" @click="$emit('change', 1)">
      <input type="radio" name="before-after" id="after" :checked="state" />
      <span class="text">After</span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.result-switcher {
  grid-area: "result-selector";
  width: 190rem;
  margin: 0 auto 28rem;
  label {
    input {
      display: none;
      &:checked + .text {
        background-color: #dbdbdb; // !@
      }
    }
    .text {
      @include shadow;
      display: inline-flex;
      justify-content: center;
      width: 50%;
      color: var(--color-text);
      background-color: var(--color-secondary-button);
      border-radius: 10rem 0 0 10rem;
      font-size: 20rem;
      line-height: 23rem;
      padding: 12rem 20rem 14rem;
    }
    &.before {
      .text {
        border-radius: 10rem 0 0 10rem;
      }
    }
    &.after {
      .text {
        border-radius: 0 10rem 10rem 0;
      }
    }
  }

  @include tablet {
    width: 260rem;
    margin-bottom: 0;
  }
}
</style>
