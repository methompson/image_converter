interface CropDimensionOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface CropAspectRatioOptions {
  ratio_width: number;
  ratio_height: number;
}
interface CropEachSideOptions {
  crop_left: number;
  crop_right: number;
  crop_top: number;
  crop_bottom: number;
}

type CropOptions =
  | CropDimensionOptions
  | CropAspectRatioOptions
  | CropEachSideOptions;

export abstract class ImageCropOptions {
  abstract get optionExport(): CropOptions;
}

export class ImageCropDimensionOptions extends ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(payload: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    super();

    const { x, y, width, height } = payload;

    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
      throw new Error('Values must be greater than or equal to 0');
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get optionExport(): CropDimensionOptions {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}

export class ImageCropAspectRatioOptions extends ImageCropOptions {
  ratio_width: number;
  ratio_height: number;

  constructor(payload: { ratio_width: number; ratio_height: number }) {
    super();

    const { ratio_width, ratio_height } = payload;

    if (ratio_width <= 0 || ratio_height <= 0) {
      throw new Error('Ratio width and height must be greater than 0');
    }

    this.ratio_width = ratio_width;
    this.ratio_height = ratio_height;
  }

  get optionExport(): CropAspectRatioOptions {
    return {
      ratio_width: this.ratio_width,
      ratio_height: this.ratio_height,
    };
  }
}

export class ImageCropEachSideOptions extends ImageCropOptions {
  crop_left: number;
  crop_right: number;
  crop_top: number;
  crop_bottom: number;

  constructor(payload: {
    crop_left: number;
    crop_right: number;
    crop_top: number;
    crop_bottom: number;
  }) {
    super();

    const { crop_left, crop_right, crop_top, crop_bottom } = payload;

    if (crop_left < 0 || crop_right < 0 || crop_top < 0 || crop_bottom < 0) {
      throw new Error('Values must be greater than or equal to 0');
    }

    this.crop_left = crop_left;
    this.crop_right = crop_right;
    this.crop_top = crop_top;
    this.crop_bottom = crop_bottom;
  }

  get optionExport(): CropEachSideOptions {
    return {
      crop_left: this.crop_left,
      crop_right: this.crop_right,
      crop_top: this.crop_top,
      crop_bottom: this.crop_bottom,
    };
  }
}
