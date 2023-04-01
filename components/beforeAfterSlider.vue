<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import { ref, onMounted } from "vue";

const slider = ref(null);

const props = defineProps({
  before: {
    type: String,
    required: true,
  },
  after: {
    type: String,
    required: true,
  },
  crops: {
    type: Array,
    required: false,
  },
  size: {
    type: Array,
    required: true,
  },
});

const lineSlide = (e: Event) => {
  slider.value?.style.setProperty("--position", `${e.target?.value}%`);
};

const showHideOnCanvas = (crop: Object) => {
  const canvas = document.querySelector("canvas");
  const img = new Image(crop.box[2], crop.box[3]);
  img.src = crop?.rgba;
  img.onload = () => {
    let ctx = canvas?.getContext("2d");
    if (crop.visible) {
      ctx?.drawImage(img, crop.box[0], crop.box[1]);
    } else {
      ctx?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
    }
  };
};

defineExpose({
  showHideOnCanvas,
});
</script>

<template>
  <div class="before-after-slider" ref="slider" @click="cropShow">
    <div class="images">
      <div class="before-wrapper">
        <img class="before" :src="before" alt="interior img before" />
      </div>
      <div class="after-wrapper">
        <img class="after" :src="after" alt="interior img after" />
        <canvas :width="size[0]" :height="size[1]" />
      </div>
    </div>
    <input type="range" min="0" max="100" value="50" @input="lineSlide" />
    <span class="line" />
    <span class="button">
      <inline-svg src="/img/icon/range-slider.svg" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.before-after-slider {
  --position: 50%;

  position: relative;
  display: grid;
  place-content: center;
  overflow: hidden;

  .images {
    position: relative;
    .before-wrapper {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white);
        opacity: 0.6;
      }
    }
    .after-wrapper {
      position: absolute;
      width: var(--position);
      inset: 0;
    }
    img,
    canvas {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: left;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  input[type="range"] {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  .line {
    position: absolute;
    inset: 0;
    width: 1rem;
    height: 100%;
    background-color: var(--gray);
    left: var(--position);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .button {
    position: absolute;
    display: grid;
    place-items: center;
    top: 50%;
    left: var(--position);
    transform: translate(-50%, -50%);
    pointer-events: none;
    svg {
      width: 26rem;
      height: 54rem;
    }
  }
}
</style>
