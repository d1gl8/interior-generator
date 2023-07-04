<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import useFiles from "@/use/files";
import useBrush from "@/use/brush";
const { sendFile, getFileFromUrl, saveFileFromURL } = useFiles();
const { initBrush, ctx, brushBuffer, size, mDown, mUp, mMove } = useBrush();

const props = defineProps({
  cleanerImage: {
    type: Object,
    required: true,
  },
  cleanerState: {
    type: Object,
    required: true,
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
const canvasBrush = ref(null);

const currentImage = computed(() => {
  return props.cleanerState.resultShow
    ? props.cleanerImage.output
    : props.cleanerImage.input;
});
const loading = ref(false);

const saveResult = async (mode: String = "local") => {
  const tempCanvas = canvasCrops.value?.cloneNode(true);
  let ctx = tempCanvas.getContext("2d");

  const background = new Image(
    props.cleanerImage.width,
    props.cleanerImage.height
  );
  background.crossOrigin = "anonymous";
  background.src = props.cleanerImage.output;

  background.onload = () => {
    ctx.drawImage(canvasCrops.value, 0, 0);
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(background, 0, 0);
    if (mode === "clip") {
      tempCanvas.toBlob((blob: Blob) =>
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      );
    }
    if (mode === "local") {
      const imageForSave = tempCanvas.toDataURL("image/png");
      saveFileFromURL(imageForSave, "cropped-interior");
    }
    tempCanvas.remove();
  };
};

const sendMask = async () => {
  console.log("sendMask");
  loading.value = true;
  const imageElem = document.querySelector(".cleaner-result img");
  const brushFile = await getFileFromUrl(
    canvasBrush.value?.toDataURL(),
    "mask.png",
    "image/png"
  );

  const toSendFormData = new FormData();
  toSendFormData.append("image_file", imageElem?.src);
  toSendFormData.append("mask_file", brushFile);

  const requestMaskedFile = await sendFile(toSendFormData, "cleaner/mask");
  const maskedFile = requestMaskedFile.value;

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

onMounted(() => {
  initBrush();
});

// watch(
//   () => props.brushSize,
//   (newSize) => {
//     ctx.value.lineWidth = newSize;
//   }
// );

defineExpose({
  sendMask,
  saveResult,
});
</script>

<template>
  <div
    class="cleaner-result"
    ref="resultImage"
    @mousemove="setCursorPosition"
    @touchmove="setCursorPosition"
    @mouseleave="cursorLeave"
  >
    <!-- @! loading -->
    <lazy-in-svg class="spinner" v-if="loading" src="/img/icon/spinner.svg" />
    <!--  -->
    <img
      :src="currentImage"
      alt="artixel interior image cleaner result"
      loading="eager"
    />
    <canvas
      v-show="cleanerState.resultShow && cleanerState.greenBoundsShow"
      ref="canvasCropsHide"
      class="canvas-hide"
      :width="cleanerImage.width"
      :height="cleanerImage.height"
    />
    <canvas
      ref="canvasCrops"
      class="canvas-crops"
      :width="cleanerImage.width"
      :height="cleanerImage.height"
    />
    <canvas
      v-show="cleanerState.editor.mode === 'eraser'"
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
      v-show="cleanerState.editor.mode === 'eraser'"
      ref="brushCursor"
      class="brush-cursor"
      :style="`left: ${x}px; top: ${y}px;`"
    />
  </div>
</template>

<style lang="scss">
.cleaner-result {
  position: relative;
  z-index: 3;
  width: 374rem;
  height: 252rem;
  background-color: var(--color-photobox);
  border-radius: 10rem;
  overflow: hidden;
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

  // @include tablet {
  //   width: 388rem;
  //   height: 258rem;
  //   margin-bottom: unset;
  // }

  // @include tabAlb {
  //   width: 644rem;
  //   height: 429rem;
  // }

  // @include laptop {
  //   width: 900rem;
  //   height: 600rem;
  // }

  // @include desktop {
  //   width: 1540rem;
  //   height: 1027rem;
  // }
}
</style>
