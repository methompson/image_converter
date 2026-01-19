import {
  ImageConverter,
  ImageResizeLongestSideOptions,
  JpegCompressionOptions,
} from "image_converter";

onmessage = async (e: MessageEvent) => {
  console.log("Worker received message:", e);

  if (e.data instanceof File) {
    console.log("Received File");

    const result = await convertImage(e.data);

    postMessage(result);
  } else {
    postMessage("Received non-File data");
  }
};

async function convertImage(file: File) {
  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({ longest_side: 1024 }),
  });

  const result = await converter.convertImageFile(file);

  return result;
}
