import { JpegCompressionOptions } from '@common/models/compression_options';
import { ImageConverterInput } from '@common/models/image_converter';
import { ImageResizeLongestSideOptions } from '@common/models/resize_options';
import { ImageConverter } from '../models/image_converter';

export function getJpegConverter(payload?: {
  quality?: number;
  longest_side?: number;
}) {
  const { quality, longest_side } = payload ?? {};

  const input: ImageConverterInput = {};

  if (quality) {
    input.compression = new JpegCompressionOptions(quality);
  }

  if (longest_side) {
    input.resize = new ImageResizeLongestSideOptions({
      longest_side: longest_side,
    });
  }

  return new ImageConverter(input);
}
