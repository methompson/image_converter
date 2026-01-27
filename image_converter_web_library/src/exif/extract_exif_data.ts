import init, {
  get_image_exif_data,
} from '@image_converter/image_converter_back_end';

export async function extractExifData(bytes: Uint8Array) {
  await init();
  return get_image_exif_data(bytes);
}
