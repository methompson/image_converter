import { PngCompressionOptions } from '@common/models/compression_options';
import { ImageConverterInput } from '@common/models/image_converter';
import { ImageResizeLongestSideOptions } from '@common/models/resize_options';
import { ImageConverter } from '@/models/image_converter';

export function getPngConverter(payload?: {
  compressionLevel?: number;
  longestSide?: number;
}) {
  const { compressionLevel, longestSide } = payload ?? {};

  const input: ImageConverterInput = {};

  if (compressionLevel) {
    input.compression = new PngCompressionOptions(compressionLevel);
  }

  if (longestSide) {
    input.resize = new ImageResizeLongestSideOptions({
      longestSide,
    });
  }

  return new ImageConverter(input);
}
