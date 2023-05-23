export default function useCrops(crops) {
  const getCanvasContexts = () => {
    const ctxCrops = document
      .querySelector(".artixel-result .canvas-crops")
      ?.getContext("2d");
    const ctxHide = document
      .querySelector(".artixel-result .canvas-hide")
      ?.getContext("2d");

    return { ctxCrops, ctxHide };
  };

  const getCropPath = (crop) => {
    // let cropsPaths: Array<Path2D> = [];

    const cropRegion = new Path2D();
    crop.contour.forEach((point: Array<number>) => {
      cropRegion?.lineTo(crop.box.x + point[0], crop.box.y + point[1]);
    });
    cropRegion.closePath();

    return cropRegion;
  };

  const cropDraw = (
    crop,
    ctxCrops: CanvasRenderingContext2D,
    ctxHide: CanvasRenderingContext2D
  ) => {
    return new Promise<void>((res, rej) => {
      const img = new Image(crop.box.width, crop.box.height);
      img.crossOrigin = "Anonymous";
      img.src = crop.rgba;

      ctxCrops.globalCompositeOperation = "source-over";
      ctxHide.globalCompositeOperation = "destination-out";

      img.onload = () => {
        ctxCrops.drawImage(img, crop.box.x, crop.box.y);
        ctxHide.fill(getCropPath(crop));
        ctxHide.stroke(getCropPath(crop));
        res();
      };
    });
  };

  const cropErase = (
    crop,
    ctxCrops: CanvasRenderingContext2D,
    ctxHide: CanvasRenderingContext2D
  ) => {
    ctxHide.globalCompositeOperation = "source-over";
    ctxCrops.globalCompositeOperation = "destination-out";

    let cropAlpha = 0.8;
    crop.intersections.top.length &&
      crop.intersections.top.forEach((el: number) => {
        cropAlpha = +(cropAlpha -= 0.1).toFixed(1);
      });
    ctxHide.globalAlpha = cropAlpha;

    ctxCrops.fill(getCropPath(crop));
    ctxHide.fill(getCropPath(crop));
    ctxHide.stroke(getCropPath(crop));
  };

  const cropShow = async (idx: number) => {
    const crop = crops.value[idx];
    const { ctxCrops, ctxHide } = getCanvasContexts();

    await cropDraw(crop, ctxCrops, ctxHide);

    if (crop.intersections.top.length) {
      crop.intersections.top.forEach(async (cropId) => {
        const cropTop = crops.value[cropId];
        cropTop.visible && (await cropDraw(cropTop, ctxCrops, ctxHide));
        !cropTop.visible && cropErase(cropTop, ctxCrops, ctxHide);
      });
    }
  };

  const cropHide = (idx: number) => {
    const crop = crops.value[idx];
    const { ctxCrops, ctxHide } = getCanvasContexts();
    ctxHide.lineWidth = 2;
    ctxHide.strokeStyle = "#50C200";
    ctxHide.fillStyle = "#378A3F";

    cropErase(crop, ctxCrops, ctxHide);

    if (crop.intersections.top.length) {
      crop.intersections.top.forEach(async (cropId) => {
        const cropTop = crops.value[cropId];
        cropTop.visible && (await cropDraw(cropTop, ctxCrops, ctxHide));
        !cropTop.visible && cropErase(cropTop, ctxCrops, ctxHide);
      });
    }
  };

  const cropShowSwitcher = (idx: number) => {
    const crop = crops.value[idx];
    crop.visible = !crop.visible;
    if (crop.visible) {
      cropShow(idx);
    } else {
      cropHide(idx);
    }
  };
  const showAllCrops = () => {
    crops.value.forEach((crop: Object, idx: number) => {
      crop.visible = true;
      cropShow(idx);
    });
  };
  const hideAllCrops = () => {
    crops.value.forEach((crop: Object, idx: number) => {
      crop.visible = false;
      cropHide(idx);
    });
  };

  return { cropShowSwitcher, showAllCrops, hideAllCrops };
}
