<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  imageData: {
    type: Object,
    required: true,
  },
});

const result = ref(null);
const crops = ref(null);

const current = ref("after");
const currentImage = computed(() => {
  return current.value === "after"
    ? props.imageData.output.image
    : props.imageData.input;
});

const showCrop = (idx: Number) => {
  const crop = props.imageData.crops[idx];
  let ctx = crops?.value.getContext("2d");
  const img = new Image(
    props.imageData.crops[idx].box[2],
    props.imageData.crops[idx].box[3]
  );
  img.src = props.imageData.crops[idx]?.rgba;
  img.onload = () => {
    ctx?.drawImage(img, crop.box[0], crop.box[1]);
  };
};

const hideCrop = (idx: Number) => {
  const crop = props.imageData.crops[idx];
  let ctx = crops?.value.getContext("2d");
  ctx?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
};

const saveImage = (mode: String = "local") => {
  const tempCanvas = crops?.value.cloneNode(true);
  let ctx = tempCanvas.getContext("2d");

  const background = new Image(
    props.imageData.output.size[0],
    props.imageData.output.size[1]
  );
  background.src = props.imageData.output.image;

  background.onload = () => {
    ctx.drawImage(crops.value, 0, 0);
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(background, 0, 0);
  };

  setTimeout(() => {
    if (mode === "clip") {
      tempCanvas.toBlob((blob: Blob) =>
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      );
    } else {
      const imageForSave = tempCanvas.toDataURL("image/png");
      let downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = imageForSave;
      downloadLink.target = "_self";
      downloadLink.download = "cropped-interior";
      downloadLink.click();
    }
  }, 100);
};

defineExpose({
  showCrop,
  hideCrop,
  saveImage,
});
</script>

<template>
  <image-selector :checked="current" @change="current = $event" />
  <div v-if="currentImage" class="result-image" ref="result">
    <img :src="currentImage" alt="artixel image handler" />
    <canvas
      ref="crops"
      class="canvas-crops"
      :width="props.imageData.output.size[0]"
      :height="props.imageData.output.size[1]"
    />
  </div>
</template>

<style lang="scss">
.result-image {
  position: relative;
  width: 374rem;
  height: 252rem;
  border-radius: 10rem;
  overflow: hidden;
  margin-bottom: 28rem;
  img {
    height: 100%;
    object-fit: contain;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
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
    width: 1275rem;
    height: 860rem;
  }
}
</style>
