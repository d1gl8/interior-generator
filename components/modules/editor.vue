<script setup lang="ts">
const props = defineProps({
  imageData: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: "crop-switcher",
  },
  brushSize: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="editor">
    <header class="editor-header">
      <h1>
        <template v-if="mode === 'crop-switcher'">
          Get some objects back
        </template>
        <template v-if="mode === 'eraser'"> Erase more manually </template>
        <in-svg src="/img-v2/icon/close.svg" @click="$emit('close')" />
      </h1>
    </header>
    <div class="crops-list" v-if="mode === 'crop-switcher'">
      <p>Tap object on photo to get it back. Or set objects manually below</p>
      <ul>
        <li
          v-for="(crop, idx) in imageData.crops"
          :key="crop.index"
          @click.stop="$emit('cropClick', idx)"
        >
          <ui-checkbox :isChecked="crop.visible" />
          <div class="crop-img">
            <img :src="crop.rgb" :alt="crop.label" />
          </div>
          <span>
            {{ crop.label }}
          </span>
        </li>
      </ul>
      <footer>
        <button class="enable" @click="$emit('showAll')">Enable all</button>
        <button class="disable" @click="$emit('hideAll')">Disable all</button>
      </footer>
    </div>
    <div class="eraser-controls" v-if="mode === 'eraser'">
      <p>Paint over objects to erase</p>
      <label for="brush-range">
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
        icon="/img-v2/icon/erase.svg"
        @click="$emit('sendMask')"
      />
    </div>
  </div>
</template>

<style lang="scss">
.editor {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-overlay);
  backdrop-filter: blur(15rem);
  padding: 28rem 20rem 0;
  &-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 322rem;
    h1 {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-header);
      font-size: 23rem;
      line-height: 23rem;
      svg {
        position: absolute;
        right: 0;
        color: var(--color-bright);
        width: 32rem;
        height: 32rem;
        cursor: pointer;
        &:hover {
          color: var(--color-bright-hover);
        }
      }
    }
  }
  p {
    @include text-body;
    width: 100%;
    text-align: center;
    color: var(--color-bright);
  }
  .crops-list {
    p {
      position: relative;
      padding-bottom: 28rem;
      margin-bottom: 28rem;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1rem;
        background-color: var(--color-icon);
      }
    }
    ul {
      max-height: 430rem;
      overflow-y: scroll;
      li {
        @include text-body;
        display: flex;
        align-items: center;
        color: var(--color-bright);
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
          img {
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
    footer {
      width: 100%;
      height: 89rem;
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      gap: 48rem;
      background: var(--color-overlay);
      backdrop-filter: blur(5rem);
      padding: 0 40rem;
      button {
        @include text-body;
        color: var(--color-bright);
        background-color: transparent;
        text-decoration: underline dotted;
        cursor: pointer;
        &:hover {
          color: var(--color-bright-hover);
        }
      }
    }
  }

  .eraser-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    column-gap: 60rem;
    padding: 0 20rem;
    p {
      width: 100%;
      margin-bottom: 40rem;
    }
    label {
      width: 156rem;
      .range-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 14rem;
        span {
          @include text-body;
          color: var(--color-bright);
        }
      }
      input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        background-color: var(--color-bright);
        border-radius: 8rem;
        margin: 8rem 0;
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
      width: unset;
    }
  }

  @include tablet {
    justify-content: flex-start;
    padding: 28rem 28rem 0;
    &-header {
      margin-bottom: 60rem;
      h1 {
        svg {
          width: 40rem;
          height: 40rem;
        }
      }
    }
    .crops-list,
    .eraser-controls {
      width: 272rem;
      margin-top: 14rem;
      margin-left: auto;
      p {
        display: inline-block;
        text-align: left;
      }
      footer {
        position: unset;
        justify-content: space-between;
        background: unset;
        backdrop-filter: unset;
        padding: 0;
      }
    }
    .eraser-controls {
      padding: unset;
      position: relative;
      padding-bottom: 40rem;
      margin-bottom: 40rem;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1rem;
        background-color: var(--color-bright);
        opacity: 0.1;
      }
      label {
        width: 100%;
        margin-bottom: 30rem;
      }
      .button {
        width: 100%;
      }
    }
  }
}
</style>
