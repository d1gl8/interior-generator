import { ref, onMounted, nextTick } from "vue";
// import useFiles from "@/use/files";
// const { sendFile, readFile, saveFileFromURL, getFileFromUrl } = useFiles();

export default function useBrush() {
  // size: Ref<{
  //   w: number;
  //   h: number;
  //   left: number;
  //   top: number;
  // }>
  // const canvasBrush = ref();
  const brushBuffer = ref();
  const ctx = ref();
  const isDrawing = ref(false);
  const lastPoint = ref({ x: 0, y: 0 });

  const size = ref({});
  const getCleanerImageCurrentSize = () => {
    const { width, height, left, top } = (
      document.querySelector(".cleaner-result") as HTMLElement
    )?.getBoundingClientRect();

    return { w: width, h: height, left, top };
  };

  onMounted(() => {
    size.value = getCleanerImageCurrentSize();
    // initBrush();
  });

  const initBrush = async () => {
    console.log("initBrush");
    // cursorLeave();
    await nextTick();
    size.value = getCleanerImageCurrentSize();
    const canvasBrush = document.querySelector(".canvas-brush");

    ctx.value = canvasBrush.getContext("2d");
    ctx.value.fillStyle = "#00FF00";
    ctx.value.strokeStyle = "#00FF00";
    ctx.value.globalAlpha = 0.075;
    ctx.value.lineWidth = 0;
    ctx.value.globalCompositeOperation = "source-over";
    brushBuffer.value = ctx.value.getImageData(
      0,
      0,
      size.value.w,
      size.value.h
    );
  };

  const distanceBetween = (point1: Point, point2: Point) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  };
  const angleBetween = (point1: Point, point2: Point) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  const mDown = (e: MouseEvent, touch: Boolean = false) => {
    isDrawing.value = true;
    if (!touch) {
      lastPoint.value = { x: e.offsetX, y: e.offsetY };
    } else {
      lastPoint.value = {
        x: e.targetTouches[0].clientX - size.value.left,
        y: e.targetTouches[0].clientY - size.value.top,
      };
    }
  };
  const mUp = (e: MouseEvent) => {
    isDrawing.value = false;
    brushBuffer.value = ctx.value.getImageData(
      0,
      0,
      size.value.w,
      size.value.h
    );
  };
  const mMove = (e: MouseEvent, touch: Boolean = false) => {
    if (!isDrawing.value) return;
    let currentPoint;
    if (!touch) {
      currentPoint = { x: e.offsetX, y: e.offsetY };
    } else {
      currentPoint = {
        x: e.targetTouches[0].clientX - size.value.left,
        y: e.targetTouches[0].clientY - size.value.top,
      };
    }

    let dist = distanceBetween(lastPoint.value, currentPoint);
    let angle = angleBetween(lastPoint.value, currentPoint);

    for (let i = 0; i < dist; i += 3) {
      let y = lastPoint.value.y + Math.cos(angle) * i;
      let x = lastPoint.value.x + Math.sin(angle) * i;

      ctx.value.beginPath();
      // @! !!!
      ctx.value.arc(x, y, 30 / 2, false, Math.PI * 2, false);
      ctx.value.closePath();
      ctx.value.fill();
    }

    lastPoint.value = currentPoint;
  };

  return {
    ctx,
    brushBuffer,
    size,
    initBrush,
    mDown,
    mUp,
    mMove,
  };
}
