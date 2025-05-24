import { PngCompressionOptions } from '@common/models/compression_options';
import { ImageConverterInput } from '@common/models/image_converter';
import { ImageResizeLongestSideOptions } from '@common/models/resize_options';
import { ImageConverter } from '@/models/image_converter';

export function getPngConverter(payload?: {
  compressionLevel?: number;
  longest_side?: number;
}) {
  const { compressionLevel, longest_side } = payload ?? {};

  const input: ImageConverterInput = {};

  if (compressionLevel) {
    input.compression = new PngCompressionOptions(compressionLevel);
  }

  if (longest_side) {
    input.resize = new ImageResizeLongestSideOptions({
      longest_side: longest_side,
    });
  }

  return new ImageConverter(input);
}
