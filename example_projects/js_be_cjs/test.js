const fs = require("node:fs/promises");

const {
  ImageConverter,
  JpegCompressionOptions,
  ImageResizeLongestSideOptions,
} = require("@metools/node-image-converter");

async function main() {
  const img = await fs.readFile("img.jpg");
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
