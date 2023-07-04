<script setup lang="ts">
import { ref } from "vue";

const TEXT = {
  objectsBack: "Place or remove objects",
  eraseManual: "Erase more manually",
  roomSurfaces: "Replace room surfaces",
  download: {
    mainButton: "Download / Share",
    clipboard: "Copy to clipboard",
    local: "Download",
    clipboardSuccess: "Copied successfully!",
  },
  downloadObjects: "Download specific objects",
  newImage: "Upload new image",
};

const props = defineProps({
  isCopyClipSuccess: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  "edit",
  "eraser",
  "saveToClipboard",
  "saveToLocal",
  "downloader",
  "upload",
]);

const drop = ref(null);
const isDropShow = ref(false);

const dropShow = () => {
  isDropShow.value = true;
  document.addEventListener("click", notDropClick);
};

const dropHide = () => {
  isDropShow.value = false;
  document.removeEventListener("click", notDropClick);
};

const notDropClick = (e: Event) => {
  if (!drop.value.contains(e.target)) dropHide();
};

defineExpose({
  dropHide,
});
</script>

<template>
  <div class="controls">
    <ui-button
      :text="TEXT.objectsBack"
      icon="/img/icon/objects-back.svg"
      @click="$emit('edit')"
    />
    <ui-button
      :text="TEXT.eraseManual"
      icon="/img/icon/erase.svg"
      @click="$emit('eraser')"
    />
    <ui-button :text="TEXT.roomSurfaces" icon="/img/icon/room-surfaces.svg" />
    <div class="button-with-dropper" ref="drop">
      <ui-button
        :text="TEXT.download.mainButton"
        icon="/img/icon/download.svg"
        green-gradient
        @click="!isDropShow ? dropShow() : dropHide()"
      />
      <ul class="drop-list" v-show="!isCopyClipSuccess && isDropShow">
        <li @click="$emit('saveToClipboard')">
          <in-svg src="/img/icon/download/to-clipboard.svg" />
          {{ TEXT.download.clipboard }}
        </li>
        <li @click="$emit('saveToLocal')">
          <in-svg src="/img/icon/download/to-local.svg" />
          {{ TEXT.download.local }}
        </li>
      </ul>
      <div class="drop-success" v-if="isCopyClipSuccess">
        <in-svg src="/img/icon/download/to-clipboard.svg" />
        {{ TEXT.download.clipboardSuccess }}
      </div>
    </div>
    <ui-button
      :text="TEXT.downloadObjects"
      icon="/img/icon/download-objects.svg"
      @click="$emit('downloader')"
    />
    <ui-button
      :text="TEXT.newImage"
      icon="/img/icon/upload.svg"
      blue
      @click="$emit('upload')"
    />
  </div>
</template>

<style lang="scss" scoped>
.controls {
  width: 100%;
  .button {
    &:not(:last-of-type) {
      margin-bottom: 28rem;
    }
  }
  .button-with-dropper {
    @include text-body;
    position: relative;
    width: inherit;
    margin-bottom: 28rem;
    svg {
      width: 24rem;
      height: 24rem;
      margin-right: 8rem;
    }
    .drop-list,
    .drop-success {
      position: absolute;
      top: 58rem;
      width: inherit;
      border-radius: 5rem;
      padding: 20rem;
    }

    .drop-list {
      list-style-type: none;
      background-color: var(--color-bright);
      box-shadow: 0px 0px 10rem rgba(137, 137, 137, 0.2);
      li {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:not(:last-of-type) {
          margin-bottom: 20rem;
        }
      }
    }
    .drop-success {
      display: flex;
      align-items: center;
      color: var(--color-toggle-on);
      background-color: var(--color-note);
    }
  }
}

// @include tablet {
//   .controls {
//     width: 260rem;
//     margin-bottom: auto;
//   }
// }
</style>
