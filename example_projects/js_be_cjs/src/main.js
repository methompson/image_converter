const { fork } = require("node:child_process");
const { TextDecoder } = require("node:util");
const { isObject, isArrayOf, isNumber } = require("@metools/tcheck");

const imgName = "IMG_3796.JPG";

main();
async function main() {
  try {
    const exifData = await getImageExifData();
    compressImage(exifData);
  } catch (e) {
    console.log("Error in main:", e);
  }
}

/**
 *
 * @returns {Promise<Uint8Array>}
 */
async function getImageExifData() {
  return new Promise(async (resolve, reject) => {
    try {
      const imgExec = fork("./src/fork_exif_data.js", [], {});

      const err = (err) => {
        const dat = new TextDecoder().decode(err);
        reject(new Error(dat));
      };

      imgExec.on("error", (error) => {
        console.log("Error:", error);
        err(error);
        imgExec.kill();
      });

      imgExec.on("message", (msg) => {
        console.log("Sender Received message", msg);

        // Apparently passing a buffer to a fork turns the data into
        // an object with type = 'Buffer' and a data array.
        if (isObject(msg) && isArrayOf(msg.data, isNumber)) {
          const buf = Buffer.from(msg.data);
          resolve(buf);
        } else {
          reject(new Error("Invalid data received from fork"));
        }

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

/**
 * @param {Uint8Array} exifData
 * @returns {Promise<void>}
 */
async function compressImage(exifData) {
  return new Promise(async (resolve, reject) => {
    try {
      const imgExec = fork("./src/fork_compress.js", [], {});

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
        exifData: Buffer.from(exifData),
      });
    } catch (e) {
      console.log("Error in spawnProcess:", e);
      reject(e);
    }
  });
}
