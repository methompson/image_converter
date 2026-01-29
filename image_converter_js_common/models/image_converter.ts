import { ImageCompressionOptions } from "./compression_options";
import { ImageCropOptions } from "./crop_options";
import { ImpageResizeOptions } from "./resize_options";

export interface ImageConverterInput {
  compression?: ImageCompressionOptions;
  resize?: ImpageResizeOptions;
  crop?: ImageCropOptions;
  stripExif?: boolean;
}

export interface ImageConversionInstanceOptions {
  exifData?: Uint8Array;
}

export abstract class AbstractImageConverter {
  compression?: ImageCompressionOptions;
  resize?: ImpageResizeOptions;
  crop?: ImageCropOptions;
  stripExif?: boolean;

  constructor(payload: ImageConverterInput) {
    this.compression = payload.compression;
    this.resize = payload.resize;
    this.crop = payload.crop;
    this.stripExif = payload.stripExif;
  }

  /**
   * Get the options to pass to the image processing function.
   */
  get options(): ImageConverterInput {
    const options: Record<string, unknown> = {};

    if (this.compression) {
      options.compressionOptions = this.compression.optionExport;
    }

    if (this.resize) {
      options.resizeOptions = this.resize.optionExport;
    }

    if (this.crop) {
      options.cropOptions = this.crop.optionExport;
    }

    if (this.stripExif !== undefined) {
      options.stripExif = this.stripExif;
    }

    return options;
  }

  abstract convertImageBytes(
    bytes: Uint8Array,
    options?: ImageConversionInstanceOptions,
  ): Promise<Uint8Array>;
}
