import { getImageDimensions } from 'image_converter';

export function sendToCompressionWorker(
  file: File,
): Promise<Uint8Array<ArrayBuffer>> {
  return new Promise((res, rej) => {
    const worker = new Worker(
      new URL('./worker_compression.ts', import.meta.url),
      {
        type: 'module',
      },
    );

    worker.onmessage = (e) => {
      console.log('Main thread received message:', e.data);

      if (e.data instanceof Uint8Array) {
        console.log('Received Uint8Array');
        res(e.data as Uint8Array<ArrayBuffer>);
      } else {
        console.log('Received non-Uint8Array data');
        rej(new Error('Received non-Uint8Array data'));
      }

      worker.terminate();
    };

    worker.postMessage(file);
  });
}

export async function sendToExifWorker(file: File) {
  return new Promise((res, rej) => {
    const worker = new Worker(new URL('./worker_exif.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (e) => {
      console.log('Main thread received message:', e.data);

      if (e.data instanceof Uint8Array) {
        console.log('Received Uint8Array');
        res(e.data as Uint8Array<ArrayBuffer>);
      } else {
        console.log('Received non-Uint8Array data');
        rej(new Error('Received non-Uint8Array data'));
      }

      worker.terminate();
    };

    worker.postMessage(file);
  });
}

export async function sendToDimensionsWorker(file: File) {
  const buf = await file.arrayBuffer();
  const fileArr = new Uint8Array(buf);

  const result = await getImageDimensions(fileArr);
  return result;
}
