export default function useCrops(crops) {
  const getCropPath = (crop) => {
    let cropsPaths: Array<Path2D> = [];

    const cropRegion = new Path2D();
    crop.contour.forEach((point: Array<number>) => {
      cropRegion?.lineTo(crop.box[0] + point[0], crop.box[1] + point[1]);
    });
    cropRegion.closePath();

    return cropRegion;
  };

  const cropShow = (idx: number) => {
    const ctxCrops = document
      .querySelector(".artixel-result .canvas-crops")
      ?.getContext("2d");
    const ctxHide = document
      .querySelector(".artixel-result .canvas-hide")
      ?.getContext("2d");
    const crop = crops.value[idx];
    console.error("show", crop.label + idx);

    ctxCrops.globalCompositeOperation = "source-over";

    const img = new Image(crop.box[2], crop.box[3]);
    img.crossOrigin = "Anonymous";
    img.src = crop?.rgba;

    ctxHide.globalCompositeOperation = "destination-out";
    ctxHide.fill(getCropPath(crop));
    ctxHide.stroke(getCropPath(crop));

    img.onload = () => {
      ctxCrops?.drawImage(img, crop.box[0], crop.box[1]);
      intersectionsRender(crop, idx);
    };
  };

  const cropHide = (idx: number) => {
    const ctxCrops = document
      .querySelector(".artixel-result .canvas-crops")
      ?.getContext("2d");
    const ctxHide = document
      .querySelector(".artixel-result .canvas-hide")
      ?.getContext("2d");
    const crop = crops.value[idx];
    console.error("hide", crop.label + idx);

    ctxHide.globalCompositeOperation = "source-over";

    let cropAlpha = 0.8;
    crop.intersections.forEach(([i, pos]: Array<number>) => {
      if (pos) cropAlpha = +(cropAlpha -= 0.1).toFixed(1);
    });
    ctxHide.globalAlpha = cropAlpha;
    console.log(cropAlpha);

    ctxHide.lineWidth = 2;
    ctxHide.strokeStyle = "#50C200";
    ctxHide.fillStyle = "#378A3F";

    ctxCrops.globalCompositeOperation = "destination-out";
    ctxCrops.fill(getCropPath(crop));

    intersectionsRender(crop, idx);

    ctxHide.fill(getCropPath(crop));
    ctxHide.stroke(getCropPath(crop));
  };

  const intersectionsRender = (crop, idx) => {
    if (crop.intersections.length) {
      // let i = 0;
      // if (i === crop.intersections.length) return;
      crop.intersections.forEach(([indx, pos]) => {
        console.log(crops.value[indx].label + indx, pos ? "down" : "up");
        if (idx < indx) {
          if (crops.value[indx].visible) cropShow(indx);
          if (!crops.value[indx].visible) cropHide(indx);
        }
        if (idx > indx) {
          // if (!crops.value[indx].visible) cropHide(indx);
        }
      });
      // i++;
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
