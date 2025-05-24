import {
  ImageConverter,
  JpegCompressionOptions,
  ImageResizeLongestSideOptions,
} from "image_converter";
import fs from "node:fs/promises";

async function main() {
  const img = await fs.readFile("../js_tests/img.jpg");
  const uint8Arr = new Uint8Array(img);

  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 800,
    }),
  });

  const result = await converter.convertImageBytes(uint8Arr);

  await fs.writeFile("./output.jpg", result);
}

main();
