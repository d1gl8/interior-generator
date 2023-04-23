<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import { ref, reactive, watch, nextTick } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";

const recaptchaInstance = useReCaptcha();
const recaptcha = async () => {
  await recaptchaInstance?.recaptchaLoaded();
  const token = await recaptchaInstance?.executeRecaptcha();

  return token;
};

const cloud = "http://34.77.60.205:6011";
const dev = "http://34.79.165.171:6011";

const WORK_STEPS = [
  {
    icon: "/img/icon/work-steps/upload.svg",
    text: "Upload photo",
  },
  {
    icon: "/img/icon/work-steps/furniture.svg",
    text: "Get furniture list",
  },
  {
    icon: "/img/icon/work-steps/remove.svg",
    text: "Remove unnecessary elements",
  },
  {
    icon: "/img/icon/work-steps/share.svg",
    text: "Share result",
  },
];
const MAIL = "contact@artixel.io";

const loading = ref(false);
const imgBefore = ref("");
const imgAfter = ref("");
const cropsData = ref([]);
const sizes = ref([]);

const befAftSlider = ref(null);
const imageContainer = ref(null);

const report = ref("");

const resetData = () => {
  imgBefore.value = "";
  imgAfter.value = "";
  cropsData.value = [];
  sizes.value = [];
};

const readFile = (file: File, as = "text") => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    if (as === "text") reader.readAsText(file);
    if (as === "url") reader.readAsDataURL(file);
  });
};

const sendFile = async (data: FormData) => {
  const options = {
    headers: {
      // Accept: "application/json",
      // "Content-Encoding": "gzip",
    },
    method: "POST",
    body: data,
  };
  const request = await fetch(`${dev}/api/predict`, options);

  return await request.formData();
};

const fileInput = async (e: Event) => {
  loading.value = true;

  console.clear();
  let file;
  e.dataTransfer
    ? (file = e.dataTransfer.files[0])
    : (file = e.target?.files[0]);
  if (!file) {
    loading.value = false;
    return;
  }
  resetData();

  const formData = new FormData();
  formData.append("file", file);
  imgBefore.value = await readFile(file, "url");

  const responseFormData = await sendFile(formData);
  console.log("responseFormData", responseFormData);

  const { crops, size } = JSON.parse(
    await readFile(responseFormData.get("locations"))
  );
  cropsData.value = crops;
  sizes.value = size;

  const output = await readFile(responseFormData.get("output"), "url");
  imgAfter.value = output;

  for (const entry of responseFormData.entries()) {
    const key = entry[0];
    const value = entry[1];
    if (key.includes("rgb")) {
      const id = +key.substring(key.indexOf("_") + 1, key.length);
      const crop = cropsData.value.find((crop) => crop.index === id);
      if (key.includes("rgb_")) crop.rgb = await readFile(value, "url");
      if (key.includes("rgba_")) crop.rgba = await readFile(value, "url");
    }
  }

  loading.value = false;
};

function saveImage(_, clipboard: boolean = false) {
  console.log(clipboard);

  const backgroundCvs = document.querySelector(".canvas-background");
  const backgroundImg = new Image(sizes.value[0], sizes.value[1]);
  backgroundImg.src = imgAfter.value;

  backgroundImg.onload = () => {
    let ctx = backgroundCvs?.getContext("2d");
    ctx?.drawImage(backgroundImg, 0, 0);
    console.log("back");
  };

  const cropsCvs = document.querySelector(".canvas-crops");
  cropsData.value.forEach((crop: Object, idx: Number) => {
    if (crop.visible) {
      const cropImg = new Image(crop.box[2], crop.box[3]);
      cropImg.src = crop?.rgba;
      cropImg.onload = () => {
        let ctx = cropsCvs?.getContext("2d");
        ctx?.drawImage(cropImg, crop.box[0], crop.box[1]);
        console.log("crop");
      };
    }
  });

  setTimeout(() => {
    const resultCvs = document.querySelector(".canvas-result");
    const resultCtx = resultCvs?.getContext("2d");
    resultCtx.drawImage(backgroundCvs, 0, 0);
    resultCtx.drawImage(cropsCvs, 0, 0);
    const result = resultCvs.toDataURL("image/png");

    if (clipboard) {
      resultCvs?.toBlob((blob) =>
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      );
    } else {
      let downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = result;
      downloadLink.target = "_self";
      downloadLink.download = "cropped-interior";
      downloadLink.click();
    }
  }, 1000);
}

const showHideCrop = (idx: Number) => {
  cropsData.value[idx].visible = !cropsData.value[idx].visible;
  befAftSlider.value.showHideOnCanvas(cropsData.value[idx], cropsData.value);
};

const modalWindow = ref(null);
const modalState = ref("");

const notModalClick = (e: Event) => {
  if (e.target.classList.contains("modal-trigger")) return;

  if (!modalWindow.value.contains(e.target)) closeModal();
};

const openModal = async (currentModal: string) => {
  modalState.value = currentModal;
  document.addEventListener("click", notModalClick);
};

const closeModal = () => {
  modalState.value = "";
  document.removeEventListener("click", notModalClick);
};

const saveReport = async () => {
  const token = await recaptcha();

  let file = new Blob([report.value], { type: "txt" });

  let a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = "bug-report";
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

const canvasEdit = () => {
  const sliderControl = document.querySelector(".before-after-slider .control");
  const sliderAfterImg = document.querySelector(".before-after-slider .after");
  sliderControl.style.setProperty("display", "none");
  sliderAfterImg.style.setProperty("display", "none");
  befAftSlider.value.initBrushCvs();
};
</script>

<template>
  <div class="page-index">
    <header>
      Clear your interior photo. Remove unwanted furniture in one click
    </header>
    <section class="container">
      <h1>How it works?</h1>
      <ul class="work-steps">
        <li v-for="(step, idx) in WORK_STEPS" :key="`work-step-${idx}`">
          <inline-svg :src="step.icon" />
          <span class="text">
            {{ step.text }}
          </span>
          <inline-svg class="next-icon" src="/img/icon/work-steps/arrow.svg" />
        </li>
      </ul>
      <inputFile
        class="input-file"
        id="imgUpload"
        icon="/img/icon/upload.svg"
        @change="fileInput"
      />
      <div class="image-section">
        <div class="left" ref="imageContainer">
          <span
            v-if="!imgAfter"
            class="no-img"
            @dragenter.prevent.stop
            @dragover.prevent.stop
            @drop.prevent.stop="fileInput"
          >
            <inline-svg v-if="!loading" src="/img/icon/upload-img.svg" />
            <loading-spinner v-else />
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
        <div class="right" v-if="imgAfter">
          <h2>Switch off objects to remove from photo</h2>
          <ul>
            <li
              v-for="(crop, key) in cropsData"
              :key="crop.label + '-' + key"
              :class="cropsData[key].visible ? 'crop-visible' : 'crop-hide'"
              @click="showHideCrop(key)"
            >
              <button>
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
          <div class="buttons">
            <button class="modal-trigger" @click="openModal('share')">
              <inline-svg src="/img/icon/share.svg" />
              Share
            </button>
            <button class="canvas-edit" @click="canvasEdit">Edit</button>
          </div>
        </div>
      </div>
      <footer>
        <button @click="openModal('report')" class="modal-trigger">
          <inline-svg src="/img/icon/bug.svg" />
          Tell us what's going wrong
        </button>
        <a :href="`mailto:${MAIL}`" class="mail">
          <inline-svg src="/img/icon/mail.svg" />
          {{ MAIL }}
        </a>
      </footer>
    </section>
  </div>
  <modal :open="!!modalState">
    <div :class="modalState" ref="modalWindow">
      <form v-if="modalState === 'report'">
        <textarea class="report-text" v-model="report" />
        <button @click="saveReport">Report</button>
      </form>

      <ul v-if="modalState === 'share'" class="share">
        <li @click="saveImage($event, true)">
          <!-- <inline-svg src="" /> -->
          <span class="text">Copy to clipboard</span>
        </li>
        <li>
          <!-- <inline-svg src="" /> -->
          <span class="text">Send to messenger</span>
        </li>
        <li @click="saveImage">
          <!-- <inline-svg src="" /> -->
          <span class="text">Save to disk</span>
        </li>
        <li>
          <!-- <inline-svg src="" /> -->
          <span class="text">Send by email</span>
        </li>
      </ul>
    </div>
  </modal>
  <template v-if="sizes">
    <canvas class="canvas-result" :width="sizes[0]" :height="sizes[1]" />
    <canvas class="canvas-background" :width="sizes[0]" :height="sizes[1]" />
  </template>
</template>

<style lang="scss" scoped>
.canvas-result,
.canvas-background {
  position: relative;
  display: none;
}

@mixin button {
  width: max-content;
  display: flex;
  align-items: center;
  font-size: 20rem;
  font-weight: 400;
  color: var(--blue);
  background-color: transparent;
  border: 2rem solid var(--blue);
  border-radius: 10rem;
}

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
  .work-steps {
    width: 100%;
    height: 52rem;
    display: flex;
    justify-content: space-between;
    font-size: 20rem;
    font-weight: 300;
    list-style: none;
    margin-bottom: 36rem;
    li {
      display: flex;
      align-items: center;
      .text {
        max-width: 202rem;
        font-size: 20rem;
        font-weight: 300;
        line-height: 24rem;
      }
      svg {
        width: 50rem;
        height: 51rem;
        color: var(--blue);
        margin-right: 15rem;
        &.next-icon {
          width: 17rem;
          height: 33rem;
          color: var(--light-gray-2);
          margin-right: 0;
          margin-left: 64rem;
        }
      }
      &:last-of-type {
        .next-icon {
          display: none;
        }
      }
    }
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
      display: grid;
      place-items: center;
      overflow: hidden;
      min-width: 814rem;
      max-height: 536rem;
      .no-img {
        width: 814rem;
        height: 536rem;
        display: grid;
        place-items: center;
        background-color: var(--blue-2);
        svg {
          width: 231rem;
          height: 231rem;
          color: var(--light-blue-2);
        }
      }
    }
    .right {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h2 {
        text-align: left;
        font-size: 20rem;
        font-weight: 500;
        color: var(--blue);
        margin-bottom: 30rem;
      }
      ul {
        max-height: 302rem;
        overflow-y: scroll;
        text-align: left;
        margin-bottom: auto;
        li {
          cursor: pointer;
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
      .buttons {
        display: flex;
        margin-top: 30rem;
      }
      .modal-trigger {
        @include button;
        padding: 16rem 32rem;
        svg {
          width: 23rem;
          height: 24rem;
          margin-right: 10rem;
        }
      }
      .canvas-edit {
        @include button;
        padding: 16rem 32rem;
        margin-left: 20rem;
      }
    }
  }
  footer {
    align-self: flex-start;
    display: flex;
    color: var(--light-gray);
    a,
    button {
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 20rem;
      font-weight: 300;
      color: inherit;
      background-color: transparent;
      border: 2px solid var(--light-gray);
      border-radius: 10rem;
      padding: 16rem 32rem;
      cursor: pointer;
      svg {
        width: 34rem;
        height: 34rem;
        margin-right: 12rem;
      }

      &.mail {
        border: none;
        color: var(--black);
        margin-left: 16rem;
      }
    }
  }
}
.modal {
  .report {
    padding: 36rem 35rem 31rem;
    .report-text {
      width: 100%;
      height: 224rem;
      font-size: 16rem;
      font-weight: 300;
      padding: 25rem 50rem 32rem 28rem;
      border: 2rem solid var(--blue);
      border-radius: 10rem;
      margin-bottom: 30rem;
    }
    button {
      width: 348rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20rem;
      color: var(--white);
      background-color: var(--blue);
      border-radius: 10rem;
      padding: 20rem 50rem;
      cursor: pointer;
      margin: 0 auto;
    }
  }
  .share {
    ul {
      list-style-type: none;
      display: grid;
      place-items: center;
      font-size: 20rem;
      font-weight: 24rem;
      padding: 52rem 112rem;
      li {
        @include button;
        width: 100%;
        padding: 16rem 28rem;
        cursor: pointer;

        &:not(:last-of-type) {
          margin-bottom: 15rem;
        }
      }
    }
  }
}
</style>
