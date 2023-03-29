<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import { ref } from "vue";

const slider = ref(null);

const props = defineProps({
  before: {
    type: String,
    required: true,
  },
  after: {
    type: String,
    required: true,
  },
});

const lineSlide = (e: Event) => {
  slider.value?.style.setProperty("--position", `${e.target?.value}%`);
};
</script>

<template>
  <div class="before-after-slider" ref="slider">
    <div class="images">
      <div class="before-wrapper">
        <img class="before" :src="before" alt="interior img before" />
      </div>
      <img class="after" :src="after" alt="interior img after" />
    </div>
    <input type="range" min="0" max="100" value="50" @input="lineSlide" />
    <span class="line" />
    <span class="button">
      <inline-svg src="/img/icon/range-slider.svg" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.before-after-slider {
  --position: 50%;

  position: relative;
  display: grid;
  place-content: center;
  overflow: hidden;

  .images {
    .before-wrapper {
      display: block;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white);
        opacity: 0.6;
        // z-index: 9;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: left;

      &.after {
        position: absolute;
        width: var(--position);
        inset: 0;
      }
    }
  }

  input[type="range"] {
    position: absolute;
    inset: 0;
    cursor: pointer;
    opacity: 0;
    /* for Firefox */
    width: 100%;
    height: 100%;
  }

  .line {
    position: absolute;
    inset: 0;
    width: 1rem;
    height: 100%;
    background-color: var(--gray);
    /* z-index: 10; */
    left: var(--position);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .button {
    position: absolute;
    display: grid;
    place-items: center;
    top: 50%;
    left: var(--position);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
}
</style>
