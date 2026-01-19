import { ImageCompressionOptions } from "./compression_options";
import { ImageCropOptions } from "./crop_options";
import { ImpageResizeOptions } from "./resize_options";

export interface ImageConverterInput {
  compression?: ImageCompressionOptions;
  resize?: ImpageResizeOptions;
  crop?: ImageCropOptions;
  exifData?: Uint8Array;
}

export abstract class AbstractImageConverter {
  compression?: ImageCompressionOptions;
  resize?: ImpageResizeOptions;
  crop?: ImageCropOptions;
  exifData?: Uint8Array;

  constructor(payload: ImageConverterInput) {
    this.compression = payload.compression;
    this.resize = payload.resize;
    this.crop = payload.crop;
    this.exifData = payload.exifData;
  }

  get options() {
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

    if (this.exifData) {
      options.exifData = this.exifData;
    }

    return options;
  }

  abstract convertImageBytes(bytes: Uint8Array): Promise<Uint8Array>;
}
