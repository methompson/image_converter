const {
  process_image,
} = require("../image-converter-back-end/pkg/image_converter_back_end");

const fs = require("node:fs/promises");

async function compress_test() {
  const img = await fs.readFile("./img.jpg");
  const uint8Arr = new Uint8Array(img);

  console.log("Processing image - jpeg 100 quality:");

  const jpg100Result = process_image(uint8Arr, {
    compressionOptions: {
      quality: 100,
      format: "jpeg",
    },
  });
  // Write to file
  await fs.writeFile("./img_100_qual.jpg", jpg100Result);

  console.log("\n");

  console.log("Processing image - jpeg 50 quality:");

  const jpg50Result = process_image(uint8Arr, {
    compressionOptions: {
      quality: 50,
      format: "jpeg",
    },
  });
  // Write to file
  await fs.writeFile("./img_50_qual.jpg", jpg50Result);

  console.log("\n");

  console.log("Processing image - png 100 quality:");

  const png100Result = process_image(uint8Arr, {
    compressionOptions: {
      quality: 100,
      format: "png",
    },
  });
  // Write to file
  await fs.writeFile("./img_100_qual.png", png100Result);

  console.log("\n");

  console.log("Processing image - png 50 quality:");

  const png50Result = process_image(uint8Arr, {
    compressionOptions: {
      quality: 50,
      format: "png",
    },
  });
  // Write to file
  await fs.writeFile("./img_50_qual.png", png50Result);

  console.log("\n");

  console.log("Processing image - gif:");

  const gifResult = process_image(uint8Arr, {
    compressionOptions: {
      format: "gif",
    },
  });
  // Write to file
  await fs.writeFile("./img.gif", gifResult);

  console.log("\n");

  console.log("Processing image - bmp:");

  const bmpResult = process_image(uint8Arr, {
    compressionOptions: {
      format: "bmp",
    },
  });
  // Write to file
  await fs.writeFile("./img.bmp", bmpResult);

  console.log("\n");

  console.log("Processing image - tiff:");

  const tiffResult = process_image(uint8Arr, {
    compressionOptions: {
      format: "tiff",
    },
  });
  // Write to file
  await fs.writeFile("./img.tiff", tiffResult);

  console.log("\n");
}

async function error_test() {
  console.log("Error Test");
  const uint8Arr = new Uint8Array([]);

  try {
    process_image(uint8Arr, {});
  } catch (e) {
    console.log("Error: ", e);
  }
}

error_test();
