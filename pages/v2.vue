<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const imageData = ref({
  isGetted: false,
  input: null,
  output: {
    image: null,
    size: null,
  },
  crops: null,
});

const currentSection = computed(() => {
  if (!imageData.value.isGetted) return "upload";
  if (editor.value.isOpen) return "image edit";
  else return "image";
});

const moduleImage = ref(null);
const moduleControls = ref(null);

const editor = ref({
  isOpen: false,
  mode: "crop-switcher",
});

const editorOpen = () => {
  if (document.documentElement.clientWidth < 768) {
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = 0;
  }
  editor.value.isOpen = true;
};
const editorClose = () => {
  if (document.documentElement.clientWidth < 768) {
    const body = document.body;
    body.style.position = "";
    body.style.top = "";
  }

  editor.value = {
    isOpen: false,
    mode: "crop-switcher",
  };
};
const eraserOpen = () => {
  editor.value.mode = "eraser";
  editorOpen();
  moduleImage.value.initBrush();
};

const cropShowSwitcher = (idx: Number) => {
  const crop = imageData.value.crops[idx];
  crop.visible = !crop.visible;
  if (crop.visible) {
    moduleImage.value.showCrop(idx);
  } else {
    moduleImage.value.hideCrop(idx);
    if (crop.intersections) {
      crop.intersections.forEach((index) => {
        const interIdx = imageData.value.crops.findIndex(
          (crop) => crop.index === index
        );

        if (imageData.value.crops[interIdx].visible) {
          moduleImage.value.showCrop(interIdx);
        }
      });
    }
  }
};
const showAllCrops = () => {
  imageData.value.crops.forEach((crop: Object, idx: Number) => {
    crop.visible = true;
    moduleImage.value.showCrop(idx);
  });
};
const hideAllCrops = () => {
  imageData.value.crops.forEach((crop: Object, idx: Number) => {
    crop.visible = false;
    moduleImage.value.hideCrop(idx);
  });
};
const brushSize = ref(0);
const brushSizeChange = (size: string) => {
  // emits("newBrushSize", e.target.value);
  document.body.style.setProperty("--brush-size", `${size}rem`);
  brushSize.value = +size;
};

const isCopyClipSuccess = ref(false);
const toClipCopy = () => {
  moduleImage.value.saveImage("clip");
  isCopyClipSuccess.value = true;
  setTimeout(() => {
    isCopyClipSuccess.value = false;
    moduleControls.value.dropHide();
  }, 1000);
};

const newUpload = () => {
  const fileInput = document.querySelector(".module-upload input[type=file]");
  fileInput.click();
};

onMounted(() => {
  brushSizeChange(
    getComputedStyle(document.body)
      .getPropertyValue("--brush-size")
      .replace("rem", "")
  );
});
</script>

<template>
  <div :class="['image-cleaner', currentSection]">
    <Header />
    <ModuleUpload
      ref="upload"
      v-show="!imageData.isGetted"
      :data="imageData"
      @loaded="imageData = $event"
    />
    <template v-if="imageData.isGetted">
      <LazyModuleImage
        ref="moduleImage"
        :imageData="imageData"
        :isEraser="editor.mode === 'eraser'"
        :brushSize="brushSize"
        @maskedFile="imageData.output.image = $event"
      />
      <LazyModuleControls
        ref="moduleControls"
        :isCopyClipSuccess="isCopyClipSuccess"
        @edit="editorOpen"
        @eraser="eraserOpen"
        @clip="toClipCopy"
        @local="moduleImage.saveImage()"
        @upload="newUpload"
      />
    </template>
    <LazyModuleEditor
      v-if="imageData.isGetted && editor.isOpen"
      :imageData="imageData"
      :mode="editor.mode"
      :brushSize="brushSize"
      @close="editorClose"
      @cropClick="cropShowSwitcher"
      @showAll="showAllCrops"
      @hideAll="hideAllCrops"
      @brushSizeChange="brushSizeChange(+$event.target.value)"
      @sendMask="moduleImage.sendMask"
    />
    <Footer />
  </div>
</template>

<style lang="scss">
.image-cleaner {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28rem 20rem 34rem;

  &.image,
  &.edit {
    .app-header {
      display: none;
    }
  }

  &.edit {
    overflow: hidden;
    .result-image {
      position: relative;
      z-index: 3;
    }
  }

  @include tablet {
    height: unset;
    padding: 38rem 40rem 0;

    &.image {
      display: grid;
      grid-template-columns: 388rem 1fr;
      grid-template-rows: 50rem 258rem 100rem;
      grid-template-areas:
        "header selector"
        "result buttons"
        "footer buttons";
      column-gap: 40rem;
      row-gap: 40rem;

      .app-header {
        grid-area: "header";
        display: flex;
        margin-bottom: 0;
        h1 {
          display: none;
        }
      }

      .app-footer {
        grid-area: footer;
        margin-bottom: auto;
      }
    }
  }

  @include tabAlb {
    &.image {
      grid-template-columns: 644rem 1fr;
      grid-template-rows: 50rem 429rem 24rem;
      grid-template-areas:
        "header selector"
        "result buttons"
        "footer footer";
    }
  }

  @include laptop {
    &.image {
      grid-template-columns: 900rem 1fr;
      grid-template-rows: 50rem 600rem 24rem;
      padding-bottom: 48rem;
      .app-header {
        h1 {
          display: block;
        }
      }
    }
  }

  @include desktop {
    &.image {
      grid-template-columns: 1540rem 1fr;
      grid-template-rows: 50rem 1027rem 24rem;
    }
  }
}
</style>
