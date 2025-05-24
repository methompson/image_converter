const {
  ImageConverter,
  JpegCompressionOptions,
  ImageResizeLongestSideOptions,
} = require("image_converter");
// const {
//   ImageConverter,
//   JpegCompressionOptions,
//   ImageResizeLongestSideOptions,
// } = require("@metools/node-image-converter");

async function main() {
  // console.log("Running stream_in.js");
  const result = new Promise((resolve) => {
    let dat = [];

    process.on("message", (data) => {
      console.log("Received message");
    });

    process.stdin.on("data", (chunk) => {
      // Process the chunk of data received from stdin
      // console.log("Recipient Received chunk:", chunk);
      dat.push(chunk);
    });

    process.stdin.on("end", async () => {
      try {
        // throw new Error("Test error");
        const arr = Uint8Array.from(Buffer.concat(dat));
        const data = await convertImage(arr);

        process.stdout.write(data);
      } catch (e) {
        const destroyExists = process.stdout.destroy;
        process.stderr.write(`Destroy exists: ${!!destroyExists}\n`);
      }
    });
  });

  await result;
}

main();

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

// console.log("Running stream_in.js");
