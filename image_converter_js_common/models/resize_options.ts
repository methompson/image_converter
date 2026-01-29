interface ResizeDimensionOptions {
  width: number;
  height: number;
}
interface ResizeAspectRatioOptions {
  ratioWidth: number;
  ratioHeight: number;
}
interface ResizeLongestSideOptions {
  longestSide: number;
}

interface ResizeDimensionsRustInput {
  width: number;
  height: number;
}
interface ResizeAspectRatioRustInput {
  ratio_width: number;
  ratio_height: number;
}
interface ResizeLongestSideRustInput {
  longest_side: number;
}

type ResizeOptions =
  | ResizeDimensionOptions
  | ResizeAspectRatioOptions
  | ResizeLongestSideOptions;

type ResizeRustOptions =
  | ResizeDimensionsRustInput
  | ResizeAspectRatioRustInput
  | ResizeLongestSideRustInput;

export abstract class ImpageResizeOptions {
  abstract get optionExport(): ResizeRustOptions;
}

export class ImageResizeDimensionOptions extends ImpageResizeOptions {
  width: number;
  height: number;

  constructor(payload: ResizeDimensionOptions) {
    super();

    if (payload.width <= 0 || payload.height <= 0) {
      throw new Error("Width and height must be greater than 0");
    }

    const { width, height } = payload;
    this.width = width;
    this.height = height;
  }

  get optionExport(): ResizeDimensionsRustInput {
    return {
      width: this.width,
      height: this.height,
    };
  }
}

export class ImageResizeAspectRatioOptions extends ImpageResizeOptions {
  ratioWidth: number;
  ratioHeight: number;

  constructor(payload: ResizeAspectRatioOptions) {
    super();

    if (payload.ratioWidth <= 0 || payload.ratioHeight <= 0) {
      throw new Error("Ratio width and height must be greater than 0");
    }

    const { ratioWidth, ratioHeight } = payload;
    this.ratioWidth = ratioWidth;
    this.ratioHeight = ratioHeight;
  }

  get optionExport(): ResizeAspectRatioRustInput {
    return {
      ratio_width: this.ratioWidth,
      ratio_height: this.ratioHeight,
    };
  }
}

export class ImageResizeLongestSideOptions extends ImpageResizeOptions {
  longestSide: number;

  constructor(payload: ResizeLongestSideOptions) {
    super();

    if (payload.longestSide <= 0) {
      throw new Error("Longest side must be greater than 0");
    }

    const { longestSide } = payload;
    this.longestSide = longestSide;
  }

  get optionExport(): ResizeLongestSideRustInput {
    return {
      longest_side: this.longestSide,
    };
  }
}
