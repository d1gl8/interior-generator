type crop = {
  label: string;
  box: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
  index: number;
  rgb: string;
  rgba: string;
  intersections: {
    bottom: number[];
    top: number[];
  };
  contour: [number, number][];
  visible: boolean;
};

type Point = {
  x: number;
  y: number;
};

interface cleanerImage {
  input: string;
  output: string;
  width: number;
  height: number;
  crops: crop[];
}
