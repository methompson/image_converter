import init, {
  process_image,
} from '../image_converter_binary/image_converter_back_end';
import {
  AbstractImageConverter,
  ImageConverterInput,
} from '@common/models/image_converter';

export class ImageConverter extends AbstractImageConverter {
  constructor(payload: ImageConverterInput) {
    super(payload);
  }

  async convertImageFile(file: File) {
    const buf = await file.arrayBuffer();
    const uint8Arr = new Uint8Array(buf);

    return this.convertImageBytes(uint8Arr);
  }

  async convertImageBytes(bytes: Uint8Array) {
    await init();

    const result = process_image(bytes, this.options);

    return result;
  }
}
