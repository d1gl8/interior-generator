<script setup lang="ts">
import { ref, computed, onMounted, provide, nextTick } from "vue";
import useCrops from "@/use/crops";
import useFiles from "@/use/files";
import useImageData from "@/use/imageData";
const config = useRuntimeConfig();
const { imageData, initClearImageData } = useImageData();
const { cropShowSwitcher, showAllCrops, hideAllCrops } = useCrops(
  computed(() => imageData.value.crops)
);
const { sendFile } = useFiles();

initClearImageData();

useHead({
  title: "Artixel.io - Clear your interior photo of unwanted furniture",
});

const error = useError();
if (error.value) {
  console.log(error);

  error.value.message = "Oops! Page not found 😔";
}

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

const imageResultLoaded = async (data: any) => {
  if (!data.isGetted) return;

  imageData.value = data;

  await nextTick();
  hideAllCrops();
};

const editorOpen = (mode: string = editor.value.mode) => {
  if (document.documentElement.clientWidth < 768) {
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = 0;
  }
  imageData.value.state = 1;

  editor.value = {
    isOpen: true,
    mode,
  };
  if (mode === "eraser") moduleImage.value.initBrush(); // !@ think about
  if (mode === "downloader") hideAllCrops();
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

const brushSize = ref(0);
const brushSizeChange = (size: string) => {
  document.body.style.setProperty("--brush-size", `${size}rem`); // @! think about
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
  initClearImageData();
  const fileInput = document.querySelector(".artixel-upload input[type=file]");
  fileInput.click();
};

const isOpenModal = ref(false);
const report = ref("");
const sendReport = async () => {
  let reportBugFile = new Blob([report.value], { type: "txt" });
  const reportSendData = new FormData();
  reportSendData.append(
    "report",
    reportBugFile,
    `report-bug-${Date.now()}.txt`
  );
  await sendFile(reportSendData, "report/bug");
  report.value = "";
  isOpenModal.value = false;
};

onMounted(async () => {
  brushSizeChange(
    getComputedStyle(document.body)
      .getPropertyValue("--brush-size")
      .replace("rem", "")
  );
});
</script>

<template>
  <div :class="['artixel-photo-cleaner', currentSection]">
    <Header />
    <ModuleUpload
      ref="upload"
      v-show="!imageData.isGetted"
      :data="imageData"
      @loaded="imageResultLoaded"
    />
    <template v-if="imageData.isGetted">
      <ModuleImage
        ref="moduleImage"
        :imageData="imageData"
        :isEraser="editor.mode === 'eraser'"
        :isCropSwitcher="editor.mode === 'crop-switcher'"
        :brushSize="brushSize"
        @changeImageState="imageData.state = $event"
        @maskedFile="imageData.output.image = $event"
      />
      <LazyModuleControls
        ref="moduleControls"
        :isCopyClipSuccess="isCopyClipSuccess"
        @edit="editorOpen"
        @eraser="editorOpen('eraser')"
        @clip="toClipCopy"
        @local="moduleImage.saveImage()"
        @downloader="editorOpen('downloader')"
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
    <Footer @clickProblems="isOpenModal = true" />
    <Modal class="report" :open="isOpenModal" @modalClose="isOpenModal = false">
      <h2>Problems?</h2>
      <form @submit.prevent>
        <textarea
          class="report-text"
          v-model="report"
          placeholder="Tell us what's going wrong"
        />
        <ui-button
          text="Send"
          icon="/img/icon/mail.svg"
          blue
          :disabled="!report.length"
          @click="sendReport"
        />
      </form>
      <in-svg
        class="close"
        src="/img/icon/close.svg"
        @click="isOpenModal = false"
      />
    </Modal>
  </div>
</template>

<style lang="scss">
.artixel-photo-cleaner {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    "header"
    "upload"
    "footer";
  padding: 28rem 20rem 34rem;

  &.image,
  &.edit {
    min-height: unset;
    .artixel-logo {
      display: none;
    }
    grid-template-areas:
      "result-selector"
      "result"
      "hide-canvas-switcher"
      "controls"
      "footer";
  }

  &.edit {
    overflow: hidden;
    grid-template-areas:
      "result-selector"
      "result"
      "hide-canvas-switcher"
      "controls"
      "footer";
    .artixel-result {
      position: relative;
      z-index: 3;
    }
    .hide-canvas-control {
      color: var(--color-bright);
    }
  }

  .report {
    .window {
      position: relative;
      h2 {
        font-size: 26rem;
        line-height: 32rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 30rem;
      }
      .report-text {
        @include text-body;
        resize: none;
        width: 100%;
        height: 200rem;
        border: 2rem solid var(--color-input);
        border-radius: 6rem;
        padding: 13rem 20rem;
        margin-bottom: 28rem;
      }
      .close {
        top: 20rem;
        right: 20rem;
      }
    }
  }

  @include tablet {
    height: unset;
    grid-template-rows: 50rem 1fr 100rem;
    place-items: center;
    padding: 38rem 40rem 0;

    &.image {
      grid-template-rows: 50rem 258rem 20rem 100rem;
      grid-template-areas:
        "header result-selector"
        "result controls"
        "hide-canvas-switcher controls"
        "footer controls";
      column-gap: 40rem;
      row-gap: 40rem;

      .artixel-logo {
        display: flex;
        margin-bottom: 0;
        h1 {
          display: none;
        }
      }

      .artixel-contacts {
        margin-bottom: auto;
      }
    }
  }

  @include tabAlb {
    &.image {
      grid-template-columns: 644rem 1fr;
      grid-template-rows: 50rem 429rem 20rem 24rem;
      grid-template-areas:
        "header result-selector"
        "result controls"
        "hide-canvas-switcher controls"
        "footer controls";
    }
  }

  @include laptop {
    &.image {
      grid-template-columns: 900rem 1fr;
      grid-template-rows: 50rem 600rem 24rem;
      padding-bottom: 48rem;
      .artixel-logo {
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
