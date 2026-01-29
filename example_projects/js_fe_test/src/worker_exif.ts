import { extractExifData } from 'image_converter';

onmessage = async (e: MessageEvent) => {
  console.log('Worker received message:', e);

  if (e.data instanceof File) {
    console.log('Received File');

    const result = await getExifData(e.data);

    postMessage(result);
  } else {
    postMessage('Received non-File data');
  }
};

async function getExifData(file: File) {
  const buf = await file.arrayBuffer();
  const fileArr = new Uint8Array(buf);

  const exifData = extractExifData(fileArr);

  return exifData;
}
