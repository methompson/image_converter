const { isRecord, isString } = require("@metools/tcheck");

const { getImageDimensions } = require("image_converter");

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

  const dimensions = await getImageDimensions(imgData);
  console.log("Image dimensions:", dimensions);
}
