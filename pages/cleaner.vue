<script setup lang="ts">
import { ref, reactive, computed, onMounted, provide, nextTick } from "vue";
import useCrops from "@/use/crops";
import useFiles from "@/use/files";
import useCleanerImage from "@/use/cleanerImage";

const TEXT = {
  upload: {
    title:
      "Clear your interior photo of unwanted furniture, replace surfaces and order new ones",
  },
};

const config = useRuntimeConfig();
const { cleanerImage, initClearCleanerImage } = useCleanerImage();
const { cropShowSwitcher, showAllCrops, hideAllCrops } = useCrops(
  computed(() => cleanerImage.value.crops)
);
const { sendFile } = useFiles();

useHead({
  title: "Artixel.io - Clear your interior photo of unwanted furniture",
});

initClearCleanerImage();

const currentSection = computed(() => {
  if (!cleanerState.cleaned) return "upload";
  if (cleanerState.editor.isOpen) return "editor";
  else return "image";
});

const cleanerState = reactive({
  loading: false,
  cleaned: computed(() => !!cleanerImage.value.output),
  resultShow: false,
  greenBoundsShow: true,
  editor: {
    isOpen: false,
    mode: "crop-switcher",
  },
});

const moduleImage = ref(null);
const moduleControls = ref(null);

const imageResultLoaded = async (data: any) => {
  cleanerImage.value = data;

  await nextTick();
  hideAllCrops();
  cleanerState.resultShow = true;
};

const brushSize = ref(0);
const brushSizeChange = (size: string) => {
  document.body.style.setProperty("--brush-size", `${size}rem`); // @! think about
  brushSize.value = +size;
};

const editorOpen = (mode: string = cleanerState.editor.mode) => {
  if (document.documentElement.clientWidth < 1366) {
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = "0";
  }
  cleanerState.resultShow = true;

  console.log("mode", mode);

  cleanerState.editor = {
    isOpen: true,
    mode,
  };

  // if (mode === "eraser") useBrush().initBrush(); // !@ think about
  if (mode === "downloader") hideAllCrops();
};
const editorClose = () => {
  if (document.documentElement.clientWidth < 1366) {
    const body = document.body;
    body.style.position = "";
    body.style.top = "";
  }

  cleanerState.editor = {
    isOpen: false,
    mode: "crop-switcher",
  };
};

const isCopyClipSuccess = ref(false);
const toClipCopy = () => {
  moduleImage.value?.saveResult("clip");
  isCopyClipSuccess.value = true;
  setTimeout(() => {
    isCopyClipSuccess.value = false;
    moduleControls.value?.dropHide();
  }, 1000);
};

const newUpload = () => {
  const fileInput: HTMLInputElement = document.querySelector(
    ".input-file input[type=file]"
  );

  fileInput?.click();
  fileInput.onchange = () => {
    initClearCleanerImage();
    cleanerState.loading = true;
  };
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
    <in-svg class="logo" src="/img/logo.svg" />
    <result-switcher
      v-if="currentSection === 'image'"
      :resultShow="cleanerState.resultShow"
      @change="cleanerState.resultShow = $event"
    />
    <div class="online-store">
      <in-svg src="/img/icon/online-store.svg" />
      <span>Online store</span>
    </div>
    <main v-show="currentSection === 'upload'">
      <h1 class="title">
        {{ TEXT.upload.title }}
      </h1>
      <ModuleUpload
        ref="upload"
        :isLoading="cleanerState.loading"
        @loading="cleanerState.loading = $event"
        @loaded="imageResultLoaded"
      />
    </main>
    <template v-if="currentSection !== 'upload'">
      <ModuleImage
        ref="moduleImage"
        :cleanerImage="cleanerImage"
        :cleanerState="cleanerState"
        :brushSize="brushSize"
        @maskedFile="cleanerImage.output = $event"
      />
      <LazyModuleControls
        ref="moduleControls"
        :isCopyClipSuccess="isCopyClipSuccess"
        @edit="editorOpen"
        @eraser="editorOpen('eraser')"
        @downloader="editorOpen('downloader')"
        @saveToClipboard="toClipCopy"
        @saveToLocal="moduleImage.saveResult()"
        @upload="newUpload"
      />
      <LazyModuleEditor
        v-if="cleanerState.cleaned && cleanerState.editor.isOpen"
        :crops="cleanerImage.crops"
        :mode="cleanerState.editor.mode"
        :greenBoundsShow="cleanerState.greenBoundsShow"
        :brushSize="brushSize"
        @close="editorClose"
        @cropClick="cropShowSwitcher"
        @greenBoundsShowSwitch="
          cleanerState.greenBoundsShow = !cleanerState.greenBoundsShow
        "
        @showAll="showAllCrops"
        @hideAll="hideAllCrops"
        @brushSizeChange="brushSizeChange(+$event.target.value)"
        @sendMask="moduleImage.sendMask"
      />
      <LazyModal
        class="report"
        :open="isOpenModal"
        @modalClose="isOpenModal = false"
      >
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
      </LazyModal>
    </template>

    <div class="problems" @click="isOpenModal = true">
      <in-svg src="/img/icon/info.svg" />
      <span>
        {{ $t("cleanerPhotoPage.problems") }}
      </span>
    </div>
    <div class="mail">
      <in-svg src="/img/icon/mail.svg" />
      <span>contact@artixel.io</span>
    </div>
  </div>
</template>

<style lang="scss">
.artixel-photo-cleaner {
  --cleaner-padding-x: 20rem;

  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 28rem var(--cleaner-padding-x) 0;

  .logo {
    grid-area: logo;
  }

  main {
    grid-area: main;
  }

  .problems,
  .mail,
  .online-store {
    display: flex;
    align-items: center;
    svg {
      width: 20rem;
      height: 20rem;
      margin-right: 6rem;
    }
    span {
      @include reg-17;
    }
  }
  .problems,
  .mail {
    align-self: end;
    position: relative;
    padding-top: 19rem;
    padding-bottom: 21rem;
    &:after {
      content: "";
      position: absolute;
      width: 50vw;
      height: 100%;
      background-color: var(--color-secondary-button);
      z-index: -1;
    }
  }
  .problems {
    grid-area: problems;
    justify-self: start;
    cursor: pointer;
    color: var(--color-text);
    &:after {
      left: calc(var(--cleaner-padding-x) * -1);
    }
  }
  .mail {
    grid-area: mail;
    justify-self: end;
    color: var(--color-placeholder);
    &:after {
      right: calc(var(--cleaner-padding-x) * -1);
    }
  }
  .online-store {
    grid-area: store;
    color: var(--color-link);
    svg {
      width: 16rem;
      height: 16rem;
    }
  }

  .result-switcher {
    grid-area: switcher;
    justify-self: center;
  }

  .cleaner-result {
    grid-area: result;
  }

  .controls {
    grid-area: controls;
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

  &.upload {
    grid-template-rows: 1fr auto 1fr;
    place-items: center;
    grid-template-areas:
      "logo logo"
      "main main"
      "problems mail";

    .logo {
      align-self: end;
      width: 260rem;
      height: 52rem;
      margin-bottom: 40rem;
    }
    main {
      .title {
        @include reg-17;
        font-weight: normal;
        text-align: center;
        margin-bottom: 44rem;
      }
    }

    .online-store {
      display: none;
    }
  }

  &.image {
    grid-template-rows: repeat(4, min-content) 1fr;
    grid-template-areas:
      "switcher switcher"
      "result result"
      "controls controls"
      "logo store"
      "problems mail";
    grid-row-gap: 28rem;

    .logo {
      padding: 32rem 0;
    }
    .online-store {
      justify-self: end;
    }
  }

  &.editor {
    .logo,
    .mail,
    .online-store,
    .controls,
    .problems,
    .report {
      display: none;
    }

    .editor-title {
      grid-area: title;
    }

    .editor-subtitle {
      grid-area: subtitle;
    }

    .hide-canvas-control,
    .eraser-controls {
      grid-area: hideCanvasSwitcher;
    }

    .crops-list {
      grid-area: cropsList;
    }

    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, min-content);
    grid-template-areas:
      "title"
      "result"
      "subtitle"
      "hideCanvasSwitcher"
      "cropsList";
    grid-row-gap: 28rem;
  }

  @include laptop {
    --cleaner-padding-x: 40rem;

    .logo {
      justify-self: start;
      width: 208rem;
      height: 42rem;
      margin: 0;
    }
    .problems,
    .mail {
      &:after {
        content: unset;
      }
    }
    .problems {
      padding-top: 8rem;
      padding-bottom: 0;
    }
    .mail {
      align-self: center;
      padding: 0;
      margin-right: 30rem;
    }
    .online-store {
      display: flex;
    }

    &.upload {
      grid-template-rows: 42rem 472rem 1fr;
      grid-template-areas:
        "logo mail store"
        "main main main"
        "problems problems problems";
      grid-row-gap: 28rem;
      padding: 28rem var(--cleaner-padding-x) 39rem;

      main {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        border: 4px dashed var(--color-line);
        .title {
          width: 100%;
          height: min-content;
          margin-top: 155rem;
          margin-bottom: 37rem;
        }
        .input-file {
          width: max-content;
        }
      }
    }

    &.image {
      grid-template-areas:
        "logo switcher mail store"
        "main main main main"
        "problems problems problems problems";
      .logo {
        padding: 0;
      }
    }
  }
}
</style>
