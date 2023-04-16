<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "input file",
  },
  accept: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
});

// !@ capture
</script>

<template>
  <div class="input-file">
    <input
      :id="id"
      type="file"
      :accept="accept"
      capture="camera"
      @change="emits('change', $event)"
    />
    <label :for="id">
      <in-svg v-if="icon" :src="icon" />
      {{ text }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
.input-file {
  input {
    display: none;
  }
  label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20rem;
    font-weight: 600;
    line-height: 23rem;
    color: var(--color-bright);
    background: var(--color-main-button);
    box-shadow: 0px 2px 0px #3479c6; // !@
    border-radius: 10rem;
    padding: 12rem 20rem 14rem;
    cursor: pointer;
    svg {
      color: var(--color-bright);
      width: 24rem;
      height: 24rem;
      margin-right: 8rem;
    }
    &:hover,
    &:active {
      background: var(--color-main-button-hover);
    }
    &:active {
      box-shadow: 0px -2px 0px #3479c6;
    }
  }
}
</style>
