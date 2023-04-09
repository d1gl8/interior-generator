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

const showHideOnCanvas = (crop: Object, crops: Array) => {
  const canvas = slider.value?.querySelector(".canvas-crops");
  const img = new Image(crop.box[2], crop.box[3]);
  img.src = crop?.rgba;
  let ctx = canvas?.getContext("2d");
  if (crop.visible) {
    img.onload = () => {
      ctx?.drawImage(img, crop.box[0], crop.box[1]);
    };
  } else {
    ctx?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
    crops.forEach((el) => {
      if (el.visible) {
        const rePaintCrop = new Image(el.box[2], el.box[3]);
        rePaintCrop.src = el?.rgba;
        rePaintCrop.onload = () => {
          ctx?.drawImage(rePaintCrop, el.box[0], el.box[1]);
        };
      }
    });
  }
};

let points = ref([]);
let brushBuffer = ref(null);
let ctx = ref();
let offset = ref(0);
let coord = ref([]);

let action = "up";
const initBrushCvs = () => {
  const brushCvs = document.querySelector(".canvas-brush");
  ctx.value = brushCvs.getContext("2d");
  ctx.value.lineWidth = 10;
  offset.value = 1000;
  ctx.value.shadowBlur = 10;
  ctx.value.shadowColor = "#000000";
  ctx.value.shadowOffsetX = -offset.value;

  points.value = [];
  brushBuffer.value = ctx.value.getImageData(
    0,
    0,
    props.size[0],
    props.size[1]
  );
};

const mDown = (e: Event) => {
  action = "down";
  points.value.push([e.offsetX, e.offsetY]);
};

const mUp = (e: Event) => {
  action = "up";
  points.value = [];
  brushBuffer.value = ctx.value.getImageData(
    0,
    0,
    props.size[0],
    props.size[1]
  );
  console.log("mask", brushBuffer.value);
};

const mMove = (e: Event) => {
  if (action == "down") {
    ctx.value.putImageData(brushBuffer.value, 0, 0);
    points.value.push([e.offsetX, e.offsetY]);
    ctx.value.beginPath();
    ctx.value.moveTo(points.value[0][0] + offset.value, points.value[0][1]);
    for (let i = 1; i < points.value.length; i++) {
      ctx.value.lineTo(points.value[i][0] + offset.value, points.value[i][1]);
    }
    ctx.value.stroke();
  }
};

onMounted(() => {
  console.log(props.crops);

  // initBrushCvs();
});

defineExpose({
  showHideOnCanvas,
  initBrushCvs,
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
        <canvas class="canvas-crops" :width="size[0]" :height="size[1]" />
        <canvas
          class="canvas-brush"
          :width="size[0]"
          :height="size[1]"
          @mousedown="mDown"
          @mousemove="mMove"
          @mouseup="mUp"
        />
      </div>
    </div>
    <div class="control">
      <input type="range" min="0" max="100" value="50" @input="lineSlide" />
      <span class="line" />
      <span class="button" @click="downloadImage">
        <inline-svg src="/img/icon/range-slider.svg" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.before-after-slider {
  --position: 50%;

  max-width: 814rem;
  max-height: 536rem;

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
    canvas:not(.canvas-brush) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: left center;
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
