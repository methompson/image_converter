const { fork } = require("node:child_process");
const { TextDecoder } = require("node:util");

const imgName = "IMG_3796.JPG";

main();
async function main() {
  try {
    getImageDimensions();
  } catch (e) {
    console.log("Error in main:", e);
  }
}

/**
 * @returns {Promise<void>}
 */
async function getImageDimensions() {
  return new Promise(async (resolve, reject) => {
    try {
      const imgExec = fork(
        "./src/image_dimensions/fork_image_dimensions.js",
        [],
        {},
      );

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
