interface CropDimensionOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface CropAspectRatioOptions {
  ratioWidth: number;
  ratioHeight: number;
}
interface CropEachSideOptions {
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
}

interface CropDimensionRustInput {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface CropAspectRatioRustInput {
  ratio_width: number;
  ratio_height: number;
}
interface CropEachSideRustInput {
  crop_left: number;
  crop_right: number;
  crop_top: number;
  crop_bottom: number;
}

type CropRustInput =
  | CropDimensionRustInput
  | CropAspectRatioRustInput
  | CropEachSideRustInput;

export abstract class ImageCropOptions {
  abstract get optionExport(): CropRustInput;
}

export class ImageCropDimensionOptions extends ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(payload: CropDimensionOptions) {
    super();

    const { x, y, width, height } = payload;

    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
      throw new Error("Values must be greater than or equal to 0");
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get optionExport(): CropDimensionRustInput {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}

export class ImageCropAspectRatioOptions extends ImageCropOptions {
  ratioWidth: number;
  ratioHeight: number;

  constructor(payload: CropAspectRatioOptions) {
    super();

    const { ratioWidth, ratioHeight } = payload;

    if (ratioWidth <= 0 || ratioHeight <= 0) {
      throw new Error("Ratio width and height must be greater than 0");
    }

    this.ratioWidth = ratioWidth;
    this.ratioHeight = ratioHeight;
  }

  get optionExport(): CropAspectRatioRustInput {
    return {
      ratio_width: this.ratioWidth,
      ratio_height: this.ratioHeight,
    };
  }
}

export class ImageCropEachSideOptions extends ImageCropOptions {
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;

  constructor(payload: CropEachSideOptions) {
    super();

    const { cropLeft, cropRight, cropTop, cropBottom } = payload;

    if (cropLeft < 0 || cropRight < 0 || cropTop < 0 || cropBottom < 0) {
      throw new Error("Values must be greater than or equal to 0");
    }

    this.cropLeft = cropLeft;
    this.cropRight = cropRight;
    this.cropTop = cropTop;
    this.cropBottom = cropBottom;
  }

  get optionExport(): CropEachSideRustInput {
    return {
      crop_left: this.cropLeft,
      crop_right: this.cropRight,
      crop_top: this.cropTop,
      crop_bottom: this.cropBottom,
    };
  }
}
