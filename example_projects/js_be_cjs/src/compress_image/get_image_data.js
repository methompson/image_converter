const fsp = require("node:fs/promises");
const path = require("node:path");

exports.getImageData = async function getImageData(imageName) {
  const filePath = path.join(".", imageName);
  const img = await fsp.readFile(filePath);

  return img;
};
