export default function useCrops(crops: Ref<crop[]>) {
  const getCanvasContexts = () => {
    const ctxCrops: CanvasRenderingContext2D = document
      .querySelector(".cleaner-result .canvas-crops")
      ?.getContext("2d");
    const ctxHide: CanvasRenderingContext2D = document
      .querySelector(".cleaner-result .canvas-hide")
      ?.getContext("2d");

    ctxHide.lineWidth = 2;
    ctxHide.strokeStyle = "#50C200";
    ctxHide.fillStyle = "#378A3F";

    return { ctxCrops, ctxHide };
  };

  const getCropPath = (crop: crop) => {
    const cropRegion = new Path2D();
    crop.contour.forEach((point: Array<number>) => {
      cropRegion?.lineTo(crop.box.x + point[0], crop.box.y + point[1]);
    });
    cropRegion.closePath();

    return cropRegion;
  };

  const cropDraw = (crop: crop) => {
    const { ctxCrops, ctxHide } = getCanvasContexts();
    return new Promise<void>((res, rej) => {
      const img = new Image(crop.box.width, crop.box.height);
      img.crossOrigin = "Anonymous";
      img.src = crop.rgba;

      ctxHide.globalCompositeOperation = "destination-out";
      ctxCrops.globalCompositeOperation = "source-over";

      img.onload = () => {
        ctxCrops.drawImage(img, crop.box.x, crop.box.y);
        ctxHide.fill(getCropPath(crop));
        ctxHide.stroke(getCropPath(crop));
        res();
      };
    });
  };
  const cropErase = (crop: crop) => {
    const { ctxCrops, ctxHide } = getCanvasContexts();
    ctxHide.globalCompositeOperation = "source-over";
    ctxCrops.globalCompositeOperation = "destination-out";

    let cropAlpha = 0.8;
    if (crop.intersections.bottom.length) {
      crop.intersections.bottom.forEach((el: number) => {
        cropAlpha = +(cropAlpha -= 0.1).toFixed(1);
      });
    }

    ctxHide.globalAlpha = cropAlpha;

    ctxCrops.fill(getCropPath(crop));
    ctxHide.fill(getCropPath(crop));
    ctxHide.stroke(getCropPath(crop));
  };

  const cropShow = async (idx: number) => {
    const crop = crops.value[idx];

    if (crop.visible) return;
    await cropDraw(crop);

    if (crop.intersections.top.length) {
      crop.intersections.top.forEach(async (cropId: number) => {
        const cropTop = crops.value[cropId];
        cropTop.visible && (await cropDraw(cropTop));
        !cropTop.visible && cropErase(cropTop);
      });
    }
  };
  const cropHide = (idx: number) => {
    const crop = crops.value[idx];

    if (!crop.visible) return;
    cropErase(crop);

    if (crop.intersections.top.length) {
      crop.intersections.top.forEach(async (cropId: number) => {
        const cropTop = crops.value[cropId];
        cropTop.visible && (await cropDraw(cropTop));
        !cropTop.visible && cropErase(cropTop);
      });
    }
  };

  const cropShowSwitcher = (idx: number) => {
    const crop = crops.value[idx];
    if (!crop.visible) {
      cropShow(idx);
    } else {
      cropHide(idx);
    }
    crop.visible = !crop.visible;
  };
  const showAllCrops = () => {
    crops.value.forEach((crop: crop, idx: number) => {
      cropShow(idx);
      crop.visible = true;
    });
  };
  const hideAllCrops = () => {
    console.log("hideAllCrops");

    crops.value.forEach((crop: crop, idx: number) => {
      cropHide(idx);
      crop.visible = false;
    });
  };

  return { cropShowSwitcher, showAllCrops, hideAllCrops };
}
