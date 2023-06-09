<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  isCopyClipSuccess: {
    type: Boolean,
    default: false,
  },
});

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
  <div class="buttons">
    <ui-button text="Get some objects back" @click="$emit('edit')" />
    <ui-button text="Erase more manually" icon="/img-v2/icon/erase.svg" />
    <div class="drop-wrapper" ref="drop">
      <ui-button
        text="Download / Share"
        icon="/img-v2/icon/download.svg"
        blue
        @click="!isDropShow ? dropShow() : dropHide()"
      />
      <ul class="drop-list" v-show="!isCopyClipSuccess && isDropShow">
        <li @click="$emit('clip')">
          <in-svg src="/img-v2/icon/download/to-clipboard.svg" />
          Copy to clipboard
        </li>
        <li @click="$emit('local')">
          <in-svg src="/img-v2/icon/download/to-local.svg" />
          Download
        </li>
        <li @click="$emit('mail')">
          <in-svg src="/img-v2/icon/download/to-mail.svg" />
          Send by email
        </li>
        <li @click="$emit('messenger')">
          <in-svg src="/img-v2/icon/download/to-messenger.svg" />
          Send to *messenger*
        </li>
      </ul>
      <div class="drop-success" v-if="isCopyClipSuccess">
        <in-svg src="/img-v2/icon/download/to-clipboard.svg" />
        Copied successfully!
      </div>
    </div>
    <ui-button text="Download specific objects" />
    <ui-button
      text="Upload new image"
      icon="/img-v2/icon/upload.svg"
      @click="$emit('upload')"
    />
  </div>
</template>

<style lang="scss" scoped>
.buttons {
  width: 100%;
  margin-bottom: 60rem;
  .button {
    &:not(:last-of-type) {
      margin-bottom: 28rem;
    }
  }
  .drop-wrapper {
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

@include tablet {
  .buttons {
    grid-area: buttons;
    width: 260rem;
    margin-bottom: auto;
  }
}
</style>
