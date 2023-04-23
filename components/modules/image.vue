<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
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
const cropsCanvas = ref(null);
const cropsHide = ref(null);

const current = ref("after");
const currentImage = computed(() => {
  return current.value === "after"
    ? props.imageData.output.image
    : props.imageData.input;
});

const showCrop = (idx: Number) => {
  const crop = props.imageData.crops[idx];
  const ctx = cropsCanvas.value.getContext("2d");
  const ctxHide = cropsHide.value.getContext("2d");
  const img = new Image(
    props.imageData.crops[idx].box[2],
    props.imageData.crops[idx].box[3]
  );
  img.src = props.imageData.crops[idx]?.rgba;
  ctxHide?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
  img.onload = () => {
    ctx?.drawImage(img, crop.box[0], crop.box[1]);
  };
};
const hideCrop = (idx: Number) => {
  const crop = props.imageData.crops[idx];
  let ctx = cropsCanvas.value.getContext("2d");

  let imgBox = ctx.getImageData(
    crop.box[0],
    crop.box[1],
    crop.box[2],
    crop.box[3]
  );

  for (let i = 0; i < imgBox.data.length; i += 4) {
    if (imgBox.data[i + 3] !== 0) {
      imgBox.data[i] = 0;
      imgBox.data[i + 1] = 106;
      imgBox.data[i + 2] = 0;
      // imgBox.data[i + 3] = 120;
    }
  }

  const ctxHide = cropsHide.value.getContext("2d");
  ctxHide.globalAlpha = 0.5;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = crop.box[2];
  tempCanvas.height = crop.box[3];

  let ctxTemp = tempCanvas.getContext("2d");
  // ctxTemp.globalAlpha = 0.5;
  ctxTemp.putImageData(imgBox, 0, 0);

  ctx?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
  ctxHide.globalCompositeOperation = "destination-over";
  ctxHide.drawImage(tempCanvas, crop.box[0], crop.box[1]);
  tempCanvas.remove();
};
const saveImage = async (mode: String = "local") => {
  const tempCanvas = cropsCanvas.value.cloneNode(true);
  let ctx = tempCanvas.getContext("2d");

  const background = new Image(size.value.w, size.value.h);
  background.src = props.imageData.output.image;

  background.onload = () => {
    ctx.drawImage(cropsCanvas.value, 0, 0);
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

const brushCanvas = ref(null);
const points = ref([]);
const brushBuffer = ref(null);
const ctx = ref();
const offset = ref(0);
const coord = ref([]);
let action = "up";
const initBrush = () => {
  cursorLeave();
  ctx.value = brushCanvas.value?.getContext("2d");
  ctx.value.lineWidth = props.brushSize;
  offset.value = 10000;
  ctx.value.globalAlpha = 0.75;
  ctx.value.shadowBlur = 2;
  ctx.value.shadowColor = "#00FF00";
  ctx.value.shadowOffsetX = -offset.value;

  points.value = [];
  brushBuffer.value = ctx.value.getImageData(0, 0, size.value.w, size.value.h);
};
const mDown = (e: Event, touch: Boolean = false) => {
  let x, y;
  action = "down";
  if (!touch) {
    x = e.offsetX;
    y = e.offsetY;
  } else {
    x = e.targetTouches[0].clientX - size.value.left;
    y = e.targetTouches[0].clientY - size.value.top;
  }
  points.value.push([x, y]);
};
const mUp = (e: Event) => {
  action = "up";
  points.value = [];
  brushBuffer.value = ctx.value.getImageData(0, 0, size.value.w, size.value.h);
};
const mMove = (e: Event, touch: Boolean = false) => {
  if (action == "down") {
    ctx.value.putImageData(brushBuffer.value, 0, 0);
    let x, y;
    if (!touch) {
      x = e.offsetX;
      y = e.offsetY;
    } else {
      x = e.targetTouches[0].clientX - size.value.left;
      y = e.targetTouches[0].clientY - size.value.top;
    }
    points.value.push([x, y]);
    ctx.value.beginPath();
    ctx.value.moveTo(points.value[0][0] + offset.value, points.value[0][1]);
    for (let i = 1; i < points.value.length; i++) {
      ctx.value.lineTo(points.value[i][0] + offset.value, points.value[i][1]);
    }
    ctx.value.stroke();
  }
};

const loading = ref(false);
const sendMask = async () => {
  loading.value = true;
  const imageElem = resultImage.value.querySelector(".result-image img");

  const imageFile = await getFileFromUrl(
    imageElem.src,
    "image-for-mask.png",
    "image/png"
  );
  const brushFile = await getFileFromUrl(
    brushCanvas.value?.toDataURL(),
    "mask.png",
    "image/png"
  );

  const toSendFormData = new FormData();
  toSendFormData.append("image_file", imageFile);
  toSendFormData.append("mask_file", brushFile);

  const requestMaskedFile = await sendFile(
    toSendFormData,
    "/api/user_mask_predict"
  );
  const responseMaskedFile = await requestMaskedFile.blob();
  const maskedFile = await readFile(responseMaskedFile, "url");
  emits("maskedFile", maskedFile);
  ctx.value.clearRect(0, 0, size.value.w, size.value.h);
  brushBuffer.value = ctx.value.getImageData(0, 0, size.value.w, size.value.h);
  loading.value = false;
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
  showCrop,
  hideCrop,
  saveImage,
  initBrush,
  sendMask,
});
</script>

<template>
  <image-selector :checked="current" @change="current = $event" />

  <div
    v-if="currentImage"
    class="result-image"
    ref="resultImage"
    @mousemove="setCursorPosition"
    @touchmove="setCursorPosition"
    @mouseleave="cursorLeave"
  >
    <lazy-in-svg class="spinner" v-if="loading" src="/img/icon/spinner.svg" />
    <img :src="currentImage" alt="artixel image handler" />
    <canvas
      ref="cropsHide"
      class="canvas-hide"
      :width="props.imageData.output.size[0]"
      :height="props.imageData.output.size[1]"
    />
    <canvas
      ref="cropsCanvas"
      class="canvas-crops"
      :width="props.imageData.output.size[0]"
      :height="props.imageData.output.size[1]"
    />
    <canvas
      v-show="isEraser"
      ref="brushCanvas"
      class="canvas-brush"
      :width="size.w"
      :height="size.h"
      @mousedown="mDown($event, true)"
      @touchstart="mDown"
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
.result-image {
  // --brush-size: 30rem;
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
    // .canvas-crops {

    //   z-index: 2;
    // }
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
