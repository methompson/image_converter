interface ResizeDimensionOptions {
  width: number;
  height: number;
}
interface ResizeAspectRatioOptions {
  ratio_width: number;
  ratio_height: number;
}
interface ResizeLongestSideOptions {
  longest_side: number;
}

type ResizeOptions =
  | ResizeDimensionOptions
  | ResizeAspectRatioOptions
  | ResizeLongestSideOptions;

export abstract class ImpageResizeOptions {
  abstract get optionExport(): ResizeOptions;
}

export class ImageResizeDimensionOptions extends ImpageResizeOptions {
  width: number;
  height: number;

  constructor(payload: { width: number; height: number }) {
    super();

    if (payload.width <= 0 || payload.height <= 0) {
      throw new Error('Width and height must be greater than 0');
    }

    const { width, height } = payload;
    this.width = width;
    this.height = height;
  }

  get optionExport(): ResizeDimensionOptions {
    return {
      width: this.width,
      height: this.height,
    };
  }
}

export class ImageResizeAspectRatioOptions extends ImpageResizeOptions {
  ratio_width: number;
  ratio_height: number;

  constructor(payload: { ratio_width: number; ratio_height: number }) {
    super();

    if (payload.ratio_width <= 0 || payload.ratio_height <= 0) {
      throw new Error('Ratio width and height must be greater than 0');
    }

    const { ratio_width, ratio_height } = payload;
    this.ratio_width = ratio_width;
    this.ratio_height = ratio_height;
  }

  get optionExport(): ResizeAspectRatioOptions {
    return {
      ratio_width: this.ratio_width,
      ratio_height: this.ratio_height,
    };
  }
}

export class ImageResizeLongestSideOptions extends ImpageResizeOptions {
  longest_side: number;

  constructor(payload: { longest_side: number }) {
    super();

    if (payload.longest_side <= 0) {
      throw new Error('Longest side must be greater than 0');
    }

    const { longest_side } = payload;
    this.longest_side = longest_side;
  }

  get optionExport(): ResizeLongestSideOptions {
    return {
      longest_side: this.longest_side,
    };
  }
}
