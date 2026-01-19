import { get_image_exif_data } from '@image_converter/image_converter_back_end';

export function extractExifData(bytes: Uint8Array) {
  return get_image_exif_data(bytes);
}
