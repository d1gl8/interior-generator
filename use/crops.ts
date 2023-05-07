export default function useCrops(crops: object) {
  const showCrop = (idx: number) => {
    const ctxCrops = document
      .querySelector(".artixel-result .canvas-crops")
      ?.getContext("2d");
    const ctxHide = document
      .querySelector(".artixel-result .canvas-hide")
      ?.getContext("2d");
    const crop = crops.value[idx];
    const img = new Image(crop.box[2], crop.box[3]);
    img.crossOrigin = "Anonymous";
    img.src = crop?.rgba;
    ctxHide?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
    img.onload = () => {
      ctxCrops?.drawImage(img, crop.box[0], crop.box[1]);
    };
  };

  const hideCrop = (idx: number) => {
    const ctxCrops = document
      .querySelector(".artixel-result .canvas-crops")
      ?.getContext("2d");
    const ctxHide = document
      .querySelector(".artixel-result .canvas-hide")
      ?.getContext("2d");
    const crop = crops.value[idx];

    let cropBox = ctxCrops.getImageData(
      crop.box[0],
      crop.box[1],
      crop.box[2],
      crop.box[3]
    );

    for (let i = 0; i < cropBox.data.length; i += 4) {
      if (cropBox.data[i + 3] !== 0) {
        cropBox.data[i] = 0;
        cropBox.data[i + 1] = 106;
        cropBox.data[i + 2] = 0;
        // cropBox.data[i + 3] = 120;
      }
    }

    ctxHide.globalAlpha = 0.5;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = crop.box[2];
    tempCanvas.height = crop.box[3];

    let ctxTemp = tempCanvas.getContext("2d");
    ctxTemp?.putImageData(cropBox, 0, 0);

    ctxCrops?.clearRect(crop.box[0], crop.box[1], crop.box[2], crop.box[3]);
    ctxHide.globalCompositeOperation = "destination-over";
    ctxHide.drawImage(tempCanvas, crop.box[0], crop.box[1]);
    tempCanvas.remove();
  };

  const intersectionsRender = (crop) => {
    if (crop.intersections) {
      crop.intersections.forEach((index) => {
        const interIdx = crops.findIndex((crop) => crop.index === index);
        if (interIdx === -1) return;
        if (crops.value[interIdx]?.visible) {
          showCrop(interIdx);
        } else {
          hideCrop(interIdx);
        }
      });
    }
  };

  const cropShowSwitcher = (idx: number) => {
    const crop = crops.value[idx];
    crop.visible = !crop.visible;
    if (crop.visible) {
      showCrop(idx);
    } else {
      hideCrop(idx);
    }
    intersectionsRender(crop);
  };
  const showAllCrops = () => {
    crops.value.forEach((crop: Object, idx: number) => {
      crop.visible = true;
      showCrop(idx);
    });
  };
  const hideAllCrops = () => {
    crops.value.forEach((crop: Object, idx: number) => {
      crop.visible = false;
      hideCrop(idx);
    });
  };

  return { cropShowSwitcher, showAllCrops, hideAllCrops };
}
