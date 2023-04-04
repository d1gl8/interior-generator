<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import { ref, reactive, watch, nextTick } from "vue";

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
const MAIL = "photoremover@gmail.com";
const REPORT =
  "С учётом сложившейся международной обстановки, высокотехнологичная концепция общественного уклада прекрасно подходит для реализации системы массового участия. Банальные, но неопровержимые выводы, а также стремящиеся вытеснить традиционное производство, нанотехнологии ассоциативно распределены по отраслям. В рамках спецификации современных стандартов, сделанные на базе интернет-аналитики выводы превращены в ";

const loading = ref(false);
const imgBefore = ref("");
const imgAfter = ref("");
const cropsData = ref([]);
const sizes = ref([]);

const befAftSlider = ref(null);
const imageContainer = ref(null);

const encodeImageFileAsURL = async (file: File) => {
  let reader = new FileReader();
  reader.onloadend = function () {
    imgBefore.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const resetData = () => {
  imgBefore.value = "";
  imgAfter.value = "";
  cropsData.value = [];
  sizes.value = [];
};

const fileInput = async (e: Event) => {
  loading.value = true;

  console.clear();
  const file = e.target?.files[0];
  if (!file) {
    loading.value = false;
    return;
  }
  resetData();

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
    const response = await request.json();
    console.log("api response", response);
    const { output, size, crops } = response;
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

function downloadImage() {
  console.log("download start");

  const canvas = document.querySelector("canvas");
  const base = new Image(sizes[0], sizes[1]);
  base.src = imgBefore.value;

  base.onload = () => {
    let ctx = canvas?.getContext("2d");
    ctx?.drawImage(base, sizes[0], sizes[1]);

    cropsData.value.forEach((crop: Object, idx: Number) => {
      if (crop.visible) {
        const cropImg = new Image(crop.box[2], crop.box[3]);
        cropImg.src = crop?.rgba;
        cropImg.onload = () => {
          ctx?.drawImage(cropImg, crop.box[0], crop.box[1]);
        };
      }

      if (cropsData.value.length - 1 === idx) {
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        console.log(canvas?.toDataURL("image/png"));

        downloadLink.href = canvas?.toDataURL("image/png");
        downloadLink.target = "_self";
        downloadLink.download = "cropped-interior";
        downloadLink.click();
      }
    });
  };
}

function saveReport() {
  let file = new Blob([REPORT], { type: "txt" });

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
}
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
          <span v-if="!imgAfter" class="no-img">
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
          <button class="modal-trigger" @click="openModal('share')">
            <inline-svg src="/img/icon/share.svg" />
            Share
          </button>
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
      <div v-if="modalState === 'report'">
        <p class="text">{{ REPORT }}</p>
        <button @click="saveReport">Report</button>
      </div>

      <ul v-if="modalState === 'share'" class="share">
        <li>
          <!-- <inline-svg src="" /> -->
          <span class="text">Copy to clipboard</span>
        </li>
        <li>
          <!-- <inline-svg src="" /> -->
          <span class="text">Send to messenger</span>
        </li>
        <li @click="downloadImage">
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
</template>

<style lang="scss" scoped>
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
      .modal-trigger {
        @include button;
        padding: 16rem 32rem;
        margin-top: 30rem;
        svg {
          width: 23rem;
          height: 24rem;
          margin-right: 10rem;
        }
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
    .text {
      font-size: 16rem;
      font-weight: 300;
      padding: 25rem 50rem 32rem 28rem;
      border: 2rem solid var(--black);
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
