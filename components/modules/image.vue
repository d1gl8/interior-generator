<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import useFiles from "@/use/files";
const { sendFile, readFile, saveFileFromURL, getFileFromUrl } = useFiles();

const props = defineProps({
  imageData: {
    type: Object,
    required: true,
  },
  isEraser: {
    type: Boolean,
    default: false,
  },
  brushSize: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["newBrushSize", "maskedFile"]);

const resultImage = ref(null);
const canvasCrops = ref(null);
const canvasCropsHide = ref(null);

const current = ref("after");
const currentImage = computed(() => {
  return current.value === "after"
    ? props.imageData.output.image
    : props.imageData.input;
});

const saveImage = async (mode: String = "local") => {
  const tempCanvas = canvasCrops.value.cloneNode(true);
  let ctx = tempCanvas.getContext("2d");

  const background = new Image(size.value.w, size.value.h);
  background.src = props.imageData.output.image;

  background.onload = () => {
    ctx.drawImage(canvasCrops.value, 0, 0);
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(background, 0, 0);
  };

  setTimeout(() => {
    if (mode === "clip") {
      tempCanvas.toBlob((blob: Blob) =>
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      );
    }
    if (mode === "local") {
      const imageForSave = tempCanvas.toDataURL("image/png");
      saveFileFromURL(imageForSave, "cropped-interior");
      tempCanvas.remove();
    }
  }, 100);
};

const loading = ref(false);
const sendMask = async () => {
  loading.value = true;
  const imageElem = document.querySelector(".artixel-result img");
  const brushFile = await getFileFromUrl(
    canvasBrush.value?.toDataURL(),
    "mask.png",
    "image/png"
  );

  const toSendFormData = new FormData();
  toSendFormData.append("image_file", imageElem?.src);
  toSendFormData.append("mask_file", brushFile);

  const requestMaskedFile = await sendFile(toSendFormData, "cleaner/mask");
  const maskedFile = requestMaskedFile.data;

  emits("maskedFile", maskedFile);
  ctx.value.clearRect(0, 0, size.value.w, size.value.h);
  brushBuffer.value = ctx.value.getImageData(0, 0, size.value.w, size.value.h);
  loading.value = false;
};

const brushCursor = ref(null);
const x = ref(0);
const y = ref(0);
const setCursorPosition = (e: MouseEvent) => {
  x.value = e.offsetX - props.brushSize / 2;
  y.value = e.offsetY - props.brushSize / 2;
};
const cursorLeave = () => {
  x.value = -props.brushSize * 2;
  y.value = -props.brushSize * 2;
};

const canvasBrush = ref(null);
const brushBuffer = ref(null);
const ctx = ref();
const isDrawing = ref(false);
const lastPoint = ref({ x: 0, y: 0 });

const distanceBetween = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};
const angleBetween = (point1, point2) => {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
};

const initBrush = () => {
  cursorLeave();
  ctx.value = canvasBrush.value?.getContext("2d");

  ctx.value.fillStyle = "#00FF00";
  ctx.value.strokeStyle = "#00FF00";
  ctx.value.globalAlpha = 0.075;
  ctx.value.lineWidth = 0;
  ctx.value.globalCompositeOperation = "source-over";
  brushBuffer.value = ctx.value.getImageData(0, 0, size.value.w, size.value.h);
};
const mDown = (e: Event, touch: Boolean = false) => {
  isDrawing.value = true;
  if (!touch) {
    lastPoint.value = { x: e.offsetX, y: e.offsetY };
  } else {
    lastPoint.value = {
      x: e.targetTouches[0].clientX - size.value.left,
      y: e.targetTouches[0].clientY - size.value.top,
    };
  }
};
const mUp = (e: Event) => {
  isDrawing.value = false;
  brushBuffer.value = ctx.value.getImageData(0, 0, size.value.w, size.value.h);
};
const mMove = (e: Event, touch: Boolean = false) => {
  if (!isDrawing.value) return;
  let currentPoint;
  if (!touch) {
    currentPoint = { x: e.offsetX, y: e.offsetY };
  } else {
    currentPoint = {
      x: e.targetTouches[0].clientX - size.value.left,
      y: e.targetTouches[0].clientY - size.value.top,
    };
  }
  let dist = distanceBetween(lastPoint.value, currentPoint);
  let angle = angleBetween(lastPoint.value, currentPoint);

  for (let i = 0; i < dist; i += 3) {
    let y = lastPoint.value.y + Math.cos(angle) * i;
    let x = lastPoint.value.x + Math.sin(angle) * i;
    ctx.value.beginPath();
    ctx.value.arc(x, y, props.brushSize / 2, false, Math.PI * 2, false);
    ctx.value.closePath();
    ctx.value.fill();
  }

  lastPoint.value = currentPoint;
};

watch(
  () => props.brushSize,
  (newSize) => {
    ctx.value.lineWidth = newSize;
  }
);

const size = ref({});
onMounted(() => {
  const imageBCR = resultImage.value.getBoundingClientRect();
  size.value = {
    w: imageBCR.width,
    h: imageBCR.height,
    left: imageBCR.left,
    top: imageBCR.top,
  };
  initBrush();
});

defineExpose({
  saveImage,
  initBrush,
  sendMask,
});
</script>

<template>
  <result-switcher :checked="current" @change="current = $event" />

  <div
    v-if="currentImage"
    class="artixel-result"
    ref="resultImage"
    @mousemove="setCursorPosition"
    @touchmove="setCursorPosition"
    @mouseleave="cursorLeave"
  >
    <lazy-in-svg class="spinner" v-if="loading" src="/img/icon/spinner.svg" />
    <img
      :src="currentImage"
      alt="artixel interior image cleaner result"
      loading="eager"
    />
    <canvas
      ref="canvasCropsHide"
      class="canvas-hide"
      :width="props.imageData.output.size[0]"
      :height="props.imageData.output.size[1]"
    />
    <canvas
      ref="canvasCrops"
      class="canvas-crops"
      :width="props.imageData.output.size[0]"
      :height="props.imageData.output.size[1]"
    />
    <canvas
      v-show="isEraser"
      ref="canvasBrush"
      class="canvas-brush"
      :width="size.w"
      :height="size.h"
      @mousedown="mDown"
      @touchstart="mDown($event, true)"
      @mousemove="mMove"
      @touchmove="mMove($event, true)"
      @mouseup="mUp"
      @touchend="mUp"
    />
    <span
      v-show="isEraser"
      ref="brushCursor"
      class="brush-cursor"
      :style="`left: ${x}px; top: ${y}px;`"
    />
  </div>
</template>

<style lang="scss">
.artixel-result {
  position: relative;
  width: 374rem;
  height: 252rem;
  border-radius: 10rem;
  overflow: hidden;
  margin-bottom: 28rem;
  .spinner {
    @include spinner;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    mix-blend-mode: multiply;
  }
  img {
    height: 100%;
    object-fit: contain;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    &.canvas-crops,
    &.canvas-hide {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &.canvas-brush {
      cursor: none;
      z-index: 3;
    }
  }
  .brush-cursor {
    pointer-events: none;
    position: absolute;
    left: calc(var(--brush-size) * -2);
    top: calc(var(--brush-size) * -2);
    display: block;
    width: var(--brush-size);
    height: var(--brush-size);
    background-color: var(--color-bright);
    opacity: 0.5;
    border-radius: 50%;
    z-index: 4;
  }

  @include tablet {
    grid-area: result;
    width: 388rem;
    height: 258rem;
    margin-bottom: unset;
  }

  @include tabAlb {
    width: 644rem;
    height: 429rem;
  }

  @include laptop {
    width: 900rem;
    height: 600rem;
  }

  @include desktop {
    width: 1540rem;
    height: 1027rem;
  }
}
</style>
