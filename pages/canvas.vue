<script setup lang="ts">
import { ref, onMounted } from "vue";

const imgBefore = ref("");
const imgAfter = ref("");
const cropsData = ref([]);
const sizes = ref([]);

let points = ref([]);
let brushBuffer = ref(null);
let ctx = ref();
let offset = ref(0);

let size = [800, 600];

let action = "up";
const initBrushCvs = () => {
  const brushCvs = document.querySelector(".canvas-brush");
  ctx.value = brushCvs.getContext("2d");
  ctx.value.lineWidth = 10;
  //смещение (больше чем ширина канвы)
  offset.value = 1000;
  //параметры тени
  ctx.value.shadowBlur = 10;
  ctx.value.shadowColor = "#000000";
  ctx.value.shadowOffsetX = -offset.value;

  points.value = [];
  brushBuffer.value = ctx.value.getImageData(0, 0, size[0], size[1]);
};

const x = (i: number) => {
  return Math.round((1024 / 800) * i);
};

const y = (i: number) => {
  return Math.round((800 / 600) * i);
};

const mDown = (e: Event) => {
  console.log(e);
  action = "down";
  points.value.push([e.offsetX, e.offsetY]);
};

const mUp = (e: Event) => {
  action = "up";
  points.value = [];
  brushBuffer.value = ctx.value.getImageData(0, 0, size[0], size[1]);
};

const mMove = (e) => {
  if (action == "down") {
    ctx.value.putImageData(brushBuffer.value, 0, 0);
    // points.value.push([x(e.pageX), y(e.pageY)]);
    points.value.push([e.offsetX, e.offsetY]);
    ctx.value.beginPath();
    ctx.value.moveTo(points.value[0][0] + offset.value, points.value[0][1]);
    for (let i = 1; i < points.value.length; i++) {
      ctx.value.lineTo(points.value[i][0] + offset.value, points.value[i][1]);
    }
    ctx.value.stroke();
  }
  // };
};

onMounted(() => {
  initBrushCvs();
  const cvs = document.querySelector("canvas");
  console.log(cvs?.getBoundingClientRect().left);
});
</script>

<template>
  <!-- <div class="wrapper" > -->
  <canvas
    class="canvas-brush"
    width="800"
    height="600"
    @mousedown="mDown"
    @mousemove="mMove"
    @mouseup="mUp"
  />
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 1024px;
  height: 768px;
  border: 3px solid black;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    height: 100%;
    width: 2px;
    background-color: black;
  }
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background-color: black;
  }
}
.canvas-brush {
  //   width: 100%;
  //   height: 100%;
  margin-top: 200px;
  margin-left: 200px;
  border: 1px solid red;
  cursor: crosshair;
}
</style>
