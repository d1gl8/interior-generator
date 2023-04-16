<script setup lang="ts">
import InlineSvg from "vue-inline-svg";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <inline-svg :src="src" />
</template>
