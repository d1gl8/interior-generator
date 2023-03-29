<script setup lang="ts">
import InlineSvg from "vue-inline-svg";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "Upload image",
  },
  icon: {
    type: String,
    required: false,
  },
});

const emits = defineEmits(["change"]);
</script>

<template>
  <div class="input-file">
    <input :id="id" type="file" @change="emits('change', $event)" />
    <label :for="id">
      <inline-svg v-if="icon" :src="icon" />
      {{ text }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
input {
  display: none;
}
label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20rem;
  color: var(--white);
  background-color: var(--blue);
  border-radius: 10rem;
  padding: 20rem 50rem;
  svg {
    width: 24rem;
    height: 24rem;
    margin-right: 10rem;
  }
}
</style>
