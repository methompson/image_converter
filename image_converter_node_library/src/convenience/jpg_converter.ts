import { JpegCompressionOptions } from '@common/models/compression_options';
import { ImageConverterInput } from '@common/models/image_converter';
import { ImageResizeLongestSideOptions } from '@common/models/resize_options';
import { ImageConverter } from '@/models/image_converter';

export function getJpegConverter(payload?: {
  quality?: number;
  longestSide?: number;
}) {
  const { quality, longestSide } = payload ?? {};

  const input: ImageConverterInput = {};

  if (quality) {
    input.compression = new JpegCompressionOptions(quality);
  }

  if (longestSide) {
    input.resize = new ImageResizeLongestSideOptions({
      longestSide,
    });
  }

  return new ImageConverter(input);
}
