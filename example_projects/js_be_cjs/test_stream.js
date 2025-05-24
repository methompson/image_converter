const fsp = require("node:fs/promises");
const fs = require("node:fs");
const { spawn, fork } = require("node:child_process");
const { TextDecoder } = require("node:util");

async function main() {
  try {
    // await spawnProcess();
    await forkProcess();
  } catch (e) {
    console.log("Error in main:", e);
  }
}

async function spawnProcess() {
  return new Promise(async (resolve, reject) => {
    try {
      const img = await fsp.readFile("img.jpg");

      const imgExec = spawn("node", ["stream_in.js"], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let dat = [];

      const err = (err) => {
        const dat = new TextDecoder().decode(err);
        // console.log(dat);
        // imgExec.kill();
        reject(new Error(dat));
      };

      imgExec.stdout.on("data", (data) => {
        // Process the chunk of data received from stdout
        // console.log("Sender Received chunk:", new TextDecoder().decode(data));
        console.log("Sender Received chunk");
        dat.push(data);
      });

      imgExec.on("close", async () => {
        console.log("End of stream");
        // console.log(imgExec.stdout.destroyed, imgExec.stderr);

        await assembleImage(dat);
        resolve();
      });

      imgExec.on("error", (error) => {
        console.log("Error:", error);
        err(error);
      });
      imgExec.stderr.on("data", (data) => {
        console.log("stderr data");
        err(data);
      });
      imgExec.stderr.on("error", (data) => {
        console.log("stderr error");
        err(data);
      });

      imgExec.stdin.write(img);
      imgExec.stdin.end();
    } catch (e) {
      console.log("Error in spawnProcess:", e);
      reject(e);
    }
  });
}

async function forkProcess() {
  return new Promise(async (resolve, reject) => {
    try {
      const imgName = "img.jpg";
      const img2Name = "img2.jpg";
      const img3Name = "img3.jpg";

      const imgExec = fork("fork_in.js", [], {});

      let dat = [];

      const err = (err) => {
        const dat = new TextDecoder().decode(err);
        reject(new Error(dat));
      };

      imgExec.on("error", (error) => {
        console.log("Error:", error);
        err(error);
      });

      imgExec.on("message", (data) => {
        console.log("Sender Received message", data);
      });

      imgExec.send(imgName);
      imgExec.send(img2Name);
      imgExec.send(img3Name);
    } catch (e) {
      console.log("Error in spawnProcess:", e);
      reject(e);
    }
  });
}

async function assembleImage(data) {
  const arr = Uint8Array.from(Buffer.concat(data));
  await fsp.writeFile("./output.jpg", arr);
}

main();
