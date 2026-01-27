const { isRecord, isString, isNumber, isArrayOf } = require("@metools/tcheck");

const {
  ImageConverter,
  ImageResizeLongestSideOptions,
  TiffCompressionOptions,
} = require("image_converter");

const fsp = require("node:fs/promises");
const { getImageData } = require("./get_image_data");

main();
async function main() {
  process.on("message", async (data) => {
    console.log("Receiver Received message");
    try {
      if (
        !(isRecord(data) && isRecord(data.exifData) && isString(data.filename))
      ) {
        throw new Error("Invalid data received in fork_compress");
      }

      const { type, data: exifDataArray } = data.exifData;

      const isExifDataValid =
        type === "Buffer" && isArrayOf(exifDataArray, isNumber);

      if (!isExifDataValid) {
        throw new Error("Invalid data received in fork_compress");
      }

      const intArr = Uint8Array.from(exifDataArray);

      await processImage(data.filename, intArr);

      process.send?.("Compression complete");
    } catch (e) {
      process.send?.("Error in processImage: " + e);
    }
  });
}

/**
 * @param {string} filename
 * @param {Uint8Array} exifData
 */
async function processImage(filename, exifData) {
  const imgData = await getImageData(filename);

  const name = newName(filename);

  const imgDat = await convertImage(imgData, exifData);
  await assembleImage(imgDat, name);
}

function newName(oldName) {
  const split = oldName.split(".");
  if (split.length < 2) {
    return `${oldName}_resized`;
  }

  const name = split.slice(0, -1).join(".");
  const ext = "tiff";

  return `${name}_resized.${ext}`;
}

async function assembleImage(data, name) {
  await fsp.writeFile(`./${name}`, data);
}

/**
 *
 * @param {Uint8Array} data
 * @param {Uint8Array} exifData
 * @returns
 */
async function convertImage(data, exifData) {
  const converter = new ImageConverter({
    compression: new TiffCompressionOptions(),
    resize: new ImageResizeLongestSideOptions({
      longestSide: 800,
    }),
  });

  const result = await converter.convertImageBytes(data, {
    exifData: exifData,
  });

  return result;
}
