// import wasm_heif from "@saschazar/wasm-heif";

import { sendToCompressionWorker, sendToExifWorker } from './send_to_worker';

export async function initDrop() {
  // await init();

  const drop = document.querySelector('#drop');

  console.log('drop?', drop);

  drop?.addEventListener('dragover', (ev) => {
    // prevent default to allow drop
    ev.preventDefault();
  });
  drop?.addEventListener('drop', async (ev) => {
    ev.preventDefault();
    if (ev instanceof DragEvent) {
      readFile(ev);
      return;
    }
  });

  // Uncomment this to start a timer to check whether the op is blocking
  // initTimer();
}

let timer: number = 0;
export function initTimer() {
  const timerDiv = document.querySelector('#timer');
  setTimeout(() => {
    if (timerDiv) {
      timerDiv.innerHTML = `Timer: ${timer}`;
    }
    timer++;
    initTimer();
  }, 500);
}

function readFile(ev: DragEvent) {
  const files = ev.dataTransfer?.files ?? [];
  for (const item of files) {
    console.log('type:', item.type);
    if (item.type === 'image/heic') {
      // readHeif(item);
    } else {
      readFileAsBytes(item);
    }
  }
}

async function readFileAsBytes(file: File) {
  console.log(file instanceof File);
  // const buf = await file.arrayBuffer();

  // const uint8Arr = new Uint8Array(buf);

  try {
    const exifData = await sendToExifWorker(file);
    const image = await sendToCompressionWorker(file);

    makeFileFromBytes(image);
  } catch (e) {
    console.error(e);
  }
}

// async function readHeif(file: File) {
//   const heifModule = await wasm_heif();
//   console.log(heifModule);

//   const buff = await file.arrayBuffer();
//   const uint8Arr = new Uint8Array(buff);

//   const decodedValue = heifModule.decode(uint8Arr, uint8Arr.length, false);
//   const dimensions = heifModule.dimensions();

//   console.log("dimensions", dimensions);

//   if (decodedValue instanceof Uint8Array) {
//     console.log(decodedValue.length);
//     console.log(uint8Arr.length);

//     const result = process_heif_image(
//       decodedValue,
//       dimensions.width,
//       dimensions.height,
//       {
//         max_size: 1000,
//         new_format: "jpeg",
//       }
//     );

//     makeFileFromBytes(result);
//   }

//   heifModule.free();
// }

function makeFileFromBytes(bytesArray: Uint8Array<ArrayBuffer>) {
  console.log('Making File', bytesArray.length);
  // const b64encoded = arrayBufferToBase64(bytesArray);
  const blob = new Blob([bytesArray]);
  const blobUrl = URL.createObjectURL(blob);

  const downloadEl = document.createElement('a');
  downloadEl.setAttribute('href', blobUrl);
  downloadEl.setAttribute('download', 'new_file.jpg');

  downloadEl.style.display = 'none';
  document.body.appendChild(downloadEl);

  downloadEl.innerHTML = 'link';

  downloadEl.click();

  document.body.removeChild(downloadEl);

  URL.revokeObjectURL(blobUrl);
}
