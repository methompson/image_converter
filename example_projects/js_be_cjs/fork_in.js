const {
  ImageConverter,
  JpegCompressionOptions,
  ImageResizeLongestSideOptions,
} = require("@metools/node-image-converter");

const fsp = require("node:fs/promises");

async function main() {
  process.on("message", async (data) => {
    console.log("Receiver Received message");
    try {
      await processImage(data);
    } catch (e) {
      process.send("Error in processImage: " + e);
    }
  });
}

function newName(oldName) {
  const split = oldName.split(".");
  if (split.length < 2) {
    return `${oldName}_resized`;
  }

  const name = split.slice(0, -1).join(".");
  const ext = split.slice(-1).join(".");

  return `${name}_resized.${ext}`;
}

async function processImage(data) {
  if (typeof data === "string") {
    const img = await fsp.readFile(data);
    // const arr = Uint8Array.from(img);

    const name = newName(data);

    const imgDat = await convertImage(img);
    await assembleImage(imgDat, name);
  }
}

async function assembleImage(data, name) {
  await fsp.writeFile(`./${name}`, data);
}

async function convertImage(data) {
  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 800,
    }),
  });

  const result = await converter.convertImageBytes(data);

  return result;
}

main();
