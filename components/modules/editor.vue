<script setup lang="ts">
import { PropType, computed } from "vue";
import useFiles from "@/use/files";
const { asyncImgToURL, saveFileFromURL } = useFiles();

const props = defineProps({
  crops: {
    type: Array as PropType<crop[]>,
    required: true,
  },
  mode: {
    type: String,
    default: "crop-switcher",
  },
  greenBoundsShow: {
    type: Boolean,
    required: true,
  },
  brushSize: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits([
  "close",
  "greenBoundsShowSwitch",
  "showAll",
  "hideAll",
  "brushSizeChange",
  "sendMask",
  "cropClick",
]);

const textData = computed(() => {
  if (props.mode === "crop-switcher") {
    return {
      headerTitle: "Get some objects back",
      listTitle:
        "Tap object on photo to get it back. Or set objects manually below",
      footer: {
        left: "Enable all",
        right: "Disable all",
      },
    };
  }
  if (props.mode === "downloader") {
    return {
      headerTitle: "Download specific objects",
      listTitle: "Tap objects on photo or choose them from the list below",
      footer: {
        left: "Check all",
        right: "Uncheck all",
        button: cropsForDownload.value.length
          ? `Download / Share (${cropsForDownload.value.length})`
          : "Download / Share",
      },
    };
  }
  if (props.mode === "eraser") {
    return {
      headerTitle: "Erase more manually",
      listTitle: "Paint over objects to erase",
    };
  }
});

const cropClck = (idx: number) => {
  if (props.mode === "downloader") {
    const i = cropsForDownload.value.findIndex((i) => i === idx);
    i < 0
      ? cropsForDownload.value.push(idx)
      : cropsForDownload.value.splice(i, 1);
  }
  if (props.mode === "crop-switcher") emits("cropClick", idx);
};

const cropsForDownload = ref([]);
const downloadCrops = () => {
  cropsForDownload.value.forEach(async (idx: number) => {
    const crop: crop = props.crops[idx];
    const cropFile = await asyncImgToURL(
      crop.rgba,
      crop.box.width,
      crop.box.height
    );
    saveFileFromURL(cropFile, `crop-object-${idx}`);
  });
};
</script>

<template>
  <h1 class="editor-title">
    {{ textData.headerTitle }}
    <in-svg class="close" src="/img/icon/close.svg" @click="$emit('close')" />
  </h1>
  <p class="editor-subtitle">{{ textData.listTitle }}</p>

  <div v-if="mode !== 'eraser'" class="hide-canvas-control">
    <ui-checkbox
      :isChecked="greenBoundsShow"
      @click="$emit('greenBoundsShowSwitch')"
    />
    <p>Show green bounds</p>
  </div>
  <div class="crops-list">
    <ul v-if="mode !== 'eraser'">
      <li
        v-for="(crop, idx) in crops"
        :key="'crop.control-' + crop.index"
        @click.stop="cropClck(idx)"
      >
        <ui-checkbox
          v-if="mode === 'crop-switcher'"
          :isChecked="crop.visible"
        />
        <ui-checkbox
          v-if="mode === 'downloader'"
          :isChecked="cropsForDownload.includes(idx)"
          :square="mode === 'downloader'"
        />
        <div class="crop-img">
          <img :src="crop.rgb" :alt="crop.label" loading="lazy" />
        </div>
        <span>
          {{ crop.label }}
        </span>
      </li>
    </ul>
    <footer>
      <template v-if="mode === 'crop-switcher'">
        <button class="enable" @click="$emit('showAll')">
          {{ textData.footer.left }}
        </button>
        <button class="disable" @click="$emit('hideAll')">
          {{ textData.footer.right }}
        </button>
        <ui-button class="apply" text="Apply" green />
      </template>
      <ui-button
        v-if="mode === 'downloader'"
        :text="textData.footer.button"
        icon="/img/icon/download.svg"
        green
        @click="downloadCrops"
      />
      <template v-if="mode === 'eraser'">
        <ui-button class="apply" text="Apply" green />
      </template>
    </footer>
  </div>
  <div class="eraser-controls" v-if="mode === 'eraser'">
    <label class="range" for="brush-range">
      <span class="range-header">
        <span>Brush</span>
        <span>{{ brushSize }}</span>
      </span>
      <input
        id="brush-range"
        type="range"
        min="10"
        max="50"
        :value="brushSize"
        step="1"
        @input="$emit('brushSizeChange', $event)"
      />
    </label>
    <ui-button
      text="Erase"
      icon="/img/icon/erase.svg"
      @click="$emit('sendMask')"
    />
  </div>
</template>

<style lang="scss">
.editor-title {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--color-text);
  font-size: 26rem;
  font-weight: 700;
  margin-top: 25rem;
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: -20rem;
    width: 100vw;
  }
  &::before {
    height: 53rem;
    top: -53rem;
    background-color: #3d3d3d;
    opacity: 0.2;
  }
  &::after {
    background-color: white;
    height: 25rem;
    top: -25rem;
    border-top-left-radius: 28rem;
    border-top-right-radius: 28rem;
  }

  .close {
    right: 0;
    color: var(--color-icon);
  }
}
p {
  @include reg-17;
  width: 100%;
  text-align: center;
  color: var(--color-placeholder);
}

.hide-canvas-control {
  @include text-body;
  display: flex;
  position: relative;
  z-index: 3;
  width: 100%;
  padding-bottom: 28rem;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rem;
    background-color: var(--color-text);
    opacity: 0.2;
  }
  p {
    text-align: unset;
    margin-left: 12rem;
  }
}

.crops-list {
  position: relative;
  ul {
    max-height: calc(100vh - 540rem);
    overflow-y: scroll;
    padding-bottom: 83rem;
    li {
      @include reg-17;
      display: flex;
      align-items: center;
      color: var(--color-text);
      cursor: pointer;
      &:not(:last-of-type) {
        margin-bottom: 28rem;
      }

      button {
        width: 31rem;
        height: 21rem;
        background-color: transparent;
        svg {
          width: 100%;
          height: 100%;
        }
      }
      .crop-img {
        width: 52rem;
        height: 52rem;
        margin: 0 16rem;
        border: 1rem solid var(--color-input);
        border-radius: 2rem;
        img {
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  footer {
    width: 100%;
    height: 81rem;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 34rem;
    background: #f5f5f5;
    padding: 0 28rem;
    button:not(.button) {
      @include text-body;
      color: var(--color-text);
      background-color: transparent;
      cursor: pointer;
      // &:hover {
      //   color: var(--color-bright-hover);
      // }
    }

    .apply {
      width: min-content;
      margin-left: auto;
      box-shadow: none;
    }
  }
}

.eraser-controls {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding-top: 28rem;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1rem;
    background-color: var(--color-text);
    opacity: 0.2;
  }
  p {
    width: 100%;
    margin-bottom: 40rem;
  }
  .range {
    width: 100%;
    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14rem;
      span {
        @include reg-17;
        color: var(--color-text);
      }
    }
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 5rem;
      display: flex;
      align-items: center;
      background-color: #d8dadb;
      border-radius: 8rem;
      margin: 8rem 0;
      cursor: pointer;
      &::-webkit-slider-runnable-track {
        box-shadow: none;
        border: none;
        background: transparent;
      }
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        display: block;
        width: 18rem;
        height: 18rem;
        background: var(--color-toggle-off);
        border: 2rem solid var(--color-bright);
        border-radius: 50%;
      }
    }
  }
  .button {
    margin-top: 40rem;
  }
}
</style>
