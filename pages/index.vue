<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import { ref } from "vue";

const loading = ref(false);
const imgBefore = ref("");
const imgAfter = ref("");
const crops = ref([]);

const encodeImageFileAsURL = async (file: File) => {
  let reader = new FileReader();
  reader.onloadend = function () {
    // console.log("RESULT", reader.result);
    imgBefore.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const toBase64 = (str: String) => {
  return `data:image/png;base64, ${str}`;
};

const fileInput = async (e: Event) => {
  console.clear();
  loading.value = true;
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
    // console.log(request);

    const response = await request.json();
    console.log("response", response);
    const { output, instances } = response;
    imgAfter.value = toBase64(output);
    instances.forEach((el: Object) => {
      el.image = toBase64(el.image);
    });
    crops.value = instances;
    console.log(crops.value);
  };

  const formData = new FormData();
  formData.append("file", file);
  await sendFile(formData);

  encodeImageFileAsURL(e.target?.files[0]);
  loading.value = false;
};
</script>

<template>
  <header>
    Clear your interior photo. Remove unwanted furniture in one click
  </header>
  <section class="page-index">
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
        <beforeAfterSlider v-else :before="imgBefore" :after="imgAfter" />
      </div>
      <div class="right">
        <h2>Switch off objects to remove from photo</h2>
        <ul>
          <li v-for="(crop, key) in crops" :key="crop.label + '-' + key">
            <button>
              <inline-svg src="/img/icon/eye.svg" />
            </button>
            <div class="crop-img">
              <img :src="crop.image" :alt="crop.label" />
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
.page-index {
  text-align: center;
  padding: 0 126rem 74rem;
  h1 {
    // text-align: center;
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
      h2 {
        text-align: left;
        font-size: 20rem;
        font-weight: 500;
        color: var(--blue);
        margin-bottom: 30rem;
      }
      ul {
        width: 410rem;
        max-height: 302rem;
        overflow: scroll;
        text-align: left;
        li {
          display: flex;
          align-items: center;
          font-size: 20rem;
          font-weight: 300;
          &:not(:last-of-type) {
            margin-bottom: 30rem;
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
    display: flex;
    text-align: left;
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
