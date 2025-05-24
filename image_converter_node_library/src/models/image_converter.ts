import { process_image } from '../image_converter_binary/image_converter_back_end';
import {
  AbstractImageConverter,
  ImageConverterInput,
} from '@common/models/image_converter';

export class ImageConverter extends AbstractImageConverter {
  constructor(payload: ImageConverterInput) {
    super(payload);
  }

  async convertImageBytes(bytes: Uint8Array) {
    const result = process_image(bytes, this.options);

    return result;
  }
}
