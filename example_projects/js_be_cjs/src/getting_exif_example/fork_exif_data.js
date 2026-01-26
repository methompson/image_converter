const { isRecord, isString } = require("@metools/tcheck");

const { getImageData } = require("./get_image_data");
const { extractExifData } = require("image_converter");

main();
async function main() {
  process.on("message", async (data) => {
    try {
      const isValid = isRecord(data) && isString(data.filename);
      if (!isValid) {
        throw new Error("Invalid data received in fork_exif_data");
      }

      const exifData = await processImage(data.filename);

      const buf1 = Buffer.from(exifData);
      process.send?.(buf1);
    } catch (e) {
      process.send?.("Error in processImage: " + e);
    }
  });
}

async function processImage(filename) {
  const fileData = await getImageData(filename);

  const binaryArray = new Uint8Array(fileData);
  console.log("processing image");
  const imgDat = extractExifData(binaryArray);

  return imgDat;
}
