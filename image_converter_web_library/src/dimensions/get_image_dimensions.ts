import { typeGuardGenerator, isNumber } from '@metools/tcheck';

import init, {
  get_image_dimensions,
} from '@image_converter/image_converter_back_end';

interface ImageDimensions {
  width: number;
  height: number;
}

const isImageDimensions = typeGuardGenerator<ImageDimensions>({
  width: isNumber,
  height: isNumber,
});

export async function getImageDimensions(
  bytes: Uint8Array,
): Promise<ImageDimensions> {
  await init();

  const data = get_image_dimensions(bytes);

  if (!isImageDimensions(data)) {
    throw new Error('Invalid image dimensions data received');
  }

  return {
    width: data.width,
    height: data.height,
  };
}
