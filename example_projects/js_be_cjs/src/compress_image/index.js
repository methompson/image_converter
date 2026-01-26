const { fork } = require("node:child_process");
const { TextDecoder } = require("node:util");

const imgName = "img.jpg";

main();
async function main() {
  try {
    compressImage();
  } catch (e) {
    console.log("Error in main:", e);
  }
}

/**
 * @returns {Promise<void>}
 */
async function compressImage() {
  return new Promise(async (resolve, reject) => {
    try {
      // const imgExec = fork("./src/getting_exif_example/fork_compress_tiff.js", [], {});
      // const imgExec = fork("./src/getting_exif_example/fork_compress_png.js", [], {});
      const imgExec = fork("./src/compress_image/fork_compress_jpg.js", [], {});

      const err = (err) => {
        const dat = new TextDecoder().decode(err);
        reject(new Error(dat));
      };

      imgExec.on("error", (error) => {
        console.log("Error:", error);
        err(error);
        imgExec.kill();
      });

      imgExec.on("message", (data) => {
        console.log("Sender Received message", data);
        resolve();
        imgExec.kill();
      });

      imgExec.send({
        filename: imgName,
      });
    } catch (e) {
      console.log("Error in spawnProcess:", e);
      reject(e);
    }
  });
}
