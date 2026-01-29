import { process_image } from '@image_converter/image_converter_back_end';
import {
  AbstractImageConverter,
  ImageConversionInstanceOptions,
  ImageConverterInput,
} from '@common/models/image_converter';

export class ImageConverter extends AbstractImageConverter {
  constructor(payload: ImageConverterInput) {
    super(payload);
  }

  async convertImageBytes(
    bytes: Uint8Array,
    options?: ImageConversionInstanceOptions,
  ) {
    const rustOptions = {
      ...this.options,
      ...(options ?? {}),
    };

    const result = process_image(bytes, rustOptions);

    return result;
  }
}
