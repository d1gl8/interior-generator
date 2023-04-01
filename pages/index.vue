<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import { ref, reactive, watch } from "vue";

const loading = ref(false);
const imgBefore = ref("");
const imgAfter = ref("");
const cropsData = ref([]);
const sizes = ref([]);

const befAftSlider = ref(null);

const encodeImageFileAsURL = async (file: File) => {
  let reader = new FileReader();
  reader.onloadend = function () {
    imgBefore.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const fileInput = async (e: Event) => {
  loading.value = true;

  console.clear();
  const file = e.target?.files[0];

  const sendFile = async (data: FormData) => {
    const options = {
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      body: data,
    };
    const request = await fetch(
      "http://91.220.69.217:6010/api/predict",
      options
    );

    const { output, size, crops } = await request.json();
    imgAfter.value = output;
    crops.forEach((crop: Object) => (crop.visible = false));
    cropsData.value = crops;
    sizes.value = size;
  };

  const formData = new FormData();
  formData.append("file", file);
  await sendFile(formData);
  await encodeImageFileAsURL(e.target?.files[0]);

  loading.value = false;
};

const showHideCrop = (idx: Number) => {
  cropsData.value[idx].visible = !cropsData.value[idx].visible;
  befAftSlider.value.showHideOnCanvas(cropsData.value[idx]);
};
</script>

<template>
  <div class="page-index">
    <header>
      Clear your interior photo. Remove unwanted furniture in one click
    </header>
    <section class="container">
      <h1>How it works?</h1>
      <div class="work-flow"></div>
      <inputFile
        class="input-file"
        id="imgUpload"
        icon="/img/icon/upload.svg"
        @change="fileInput"
      />
      <div class="image-section">
        <div class="left">
          <span v-if="!imgAfter" class="no-img">
            <span class="loading" v-if="loading">loading ...</span>
          </span>
          <beforeAfterSlider
            v-else
            ref="befAftSlider"
            :before="imgBefore"
            :after="imgAfter"
            :crops="cropsData"
            :size="sizes"
          />
        </div>
        <div class="right">
          <h2>Switch off objects to remove from photo</h2>
          <ul>
            <li
              v-for="(crop, key) in cropsData"
              :key="crop.label + '-' + key"
              :class="cropsData[key].visible ? 'crop-visible' : 'crop-hide'"
            >
              <button @click="showHideCrop(key)">
                <inline-svg src="/img/icon/eye.svg" />
              </button>
              <div class="crop-img">
                <img :src="crop.rgb" :alt="crop.label" />
              </div>
              <span>
                {{ crop.label }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <footer>
        <button>
          <inline-svg src="/img/icon/bug.svg" />
          Tell us what's going wrong
        </button>
        <button class="mail">
          <inline-svg src="/img/icon/mail.svg" />
          photoremover@gmail.com
        </button>
      </footer>
    </section>
  </div>
</template>

<style lang="scss" scoped>
header {
  height: 52rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--black);
  font-size: 24rem;
  font-weight: 300;
  background-color: var(--light-blue);
  margin-bottom: 24rem;
}
.container {
  max-width: 1440rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 74rem 126rem;
  margin: 0 auto;
  h1 {
    margin-bottom: 24rem;
  }
  .work-flow {
    height: 52rem;
    margin-bottom: 36rem;
  }
  .input-file {
    margin-bottom: 36rem;
  }
  .image-section {
    width: 100%;
    display: flex;
    gap: 65rem;
    margin-bottom: 32rem;
    .left {
      min-width: 814rem;
      width: 814rem;
      height: 536rem;
      .no-img {
        width: inherit;
        height: inherit;
        display: grid;
        place-items: center;
        background-color: var(--light-blue);
        .loading {
          font-size: 24rem;
        }
      }
      img {
        width: 100%;
      }
    }
    .right {
      width: 100%;
      h2 {
        text-align: left;
        font-size: 20rem;
        font-weight: 500;
        color: var(--blue);
        margin-bottom: 30rem;
      }
      ul {
        // width: 410rem;
        max-height: 302rem;
        overflow-y: scroll;
        text-align: left;
        li {
          display: flex;
          align-items: center;
          font-size: 20rem;
          font-weight: 300;
          &:not(:last-of-type) {
            margin-bottom: 30rem;
          }
          &.crop-hide {
            opacity: 0.2;
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
            width: 85rem;
            height: 53rem;
            margin-right: 20rem;
            margin-left: 20rem;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
  }
  footer {
    align-self: flex-start;
    display: flex;
    color: var(--light-gray);
    button {
      display: flex;
      align-items: center;
      font-size: 20rem;
      color: inherit;
      background-color: transparent;
      border: 2px solid var(--light-gray);
      border-radius: 10rem;
      padding: 16rem 32rem;
      svg {
        width: 34rem;
        height: 34rem;
        margin-right: 12rem;
      }

      &.mail {
        border: none;
        margin-left: 16rem;
      }
    }
  }
}
</style>
