const { isRecord, isString } = require("@metools/tcheck");

const {
  ImageConverter,
  JpegCompressionOptions,
  ImageResizeLongestSideOptions,
  ImageCropAspectRatioOptions,
} = require("image_converter");

const fsp = require("node:fs/promises");
const { getImageData } = require("./get_image_data");

main();
async function main() {
  process.on("message", async (data) => {
    console.log("Receiver Received message");
    try {
      if (!(isRecord(data) && isString(data.filename))) {
        throw new Error("Invalid data received in fork_compress");
      }

      await processImage(data.filename);

      process.send?.("Compression complete");
    } catch (e) {
      process.send?.("Error in processImage: " + e);
    }
  });
}

/**
 * @param {string} filename
 */
async function processImage(filename) {
  const imgData = await getImageData(filename);

  const name = newName(filename);

  const imgDat = await convertImage(imgData);
  await assembleImage(imgDat, name);
}

function newName(oldName) {
  const split = oldName.split(".");
  if (split.length < 2) {
    return `${oldName}_resized`;
  }

  const name = split.slice(0, -1).join(".");
  const ext = "jpg";

  return `${name}_resized.${ext}`;
}

async function assembleImage(data, name) {
  console.log("Writing file:", name);
  await fsp.writeFile(`./${name}`, data);
}

/**
 *
 * @param {Uint8Array} data
 * @returns
 */
async function convertImage(data) {
  const converter = new ImageConverter({
    // stripExif: true,
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({
      longestSide: 800,
    }),
    crop: new ImageCropAspectRatioOptions({
      ratioHeight: 1,
      ratioWidth: 1,
    }),
  });

  const result = await converter.convertImageBytes(data);

  return result;
}
