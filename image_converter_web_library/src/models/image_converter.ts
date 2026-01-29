import init, { process_image } from '@image_converter/image_converter_back_end';
import {
  AbstractImageConverter,
  ImageConversionInstanceOptions,
  ImageConverterInput,
} from '@common/models/image_converter';

export class ImageConverter extends AbstractImageConverter {
  constructor(payload: ImageConverterInput) {
    super(payload);
  }

  async convertImageFile(file: File, options?: ImageConversionInstanceOptions) {
    const buf = await file.arrayBuffer();
    const uint8Arr = new Uint8Array(buf);

    return this.convertImageBytes(uint8Arr, options);
  }

  async convertImageBytes(
    bytes: Uint8Array,
    options?: ImageConversionInstanceOptions,
  ) {
    await init();

    const rustOptions = {
      ...this.options,
      ...(options ?? {}),
    };

    const result = process_image(bytes, rustOptions);

    return result;
  }
}
