# Image Converter Module for JavaScript Web & Node

### An image-converter for JavaScript, written in Rust.

### @metools/node-image-converter

### @metools/web-image-converter

Ever had a really large image that you wanted to compress quickly?

Do users upload enormous 20 megapixel photos to your website?

Do you want to cut down on file uploads and compute on your servers?

This package is for you!

This project is a Node & Web compatible package for converting images. It has basic operations for resizing, cropping and compressing images. It can read from and convert to the following formats:

- Jpeg
- Png
- Gif
- Bmp
- Targa/Tga
- Tiff

The meat of the project is written in Rust and exported into a WebAssembly binary. The project also contains a TypeScript API for interacting with the WebAssembly back end.

## Installation

Just install the package with your package manager of choice.

For Web:

`npm install @metools/web-image-converter`

For Node:

`npm install @metools/node-image-converter`

Each package is specific to the environment at hand and cannot be used interchangeably. As such, pick the package for your use case.

## Bundler Caveats

WebAssembly is still not a first class citizen among all bundlers and dev servers, so some bundlers and dev servers may have an issue serving Wasm files or adding them to the build directory. Below are lists of caveates and workarounds for bundlers:

### Vite

When bundling an app with Vite, you will need to prevent the package from being optimized using the `optimizeDeps.exclude` API:

```ts
import { defineConfig } from "vite";
export default defineConfig({
  optimizeDeps: {
    exclude: ["@metools/web-image-converter"],
  },
});
```

### tsup

When bundling an app with tsup, it doesn't automatically copy any wasm files into the dist folder. The expectation of a Node back end project is that you will be operating the application with a `node_modules` folder, which allows you to access the `@metools/node-image-converter` project directly, along with the APIs to interact with the converter. If the intention of the project is to bundle all dependencies into a single JS file (e.g. a single file script that is meant to be run like a CLI tool), you will likely need to use a combination of `noExternal` in tsup's `defineConfig` API and converting the wasm binary into a base64 string that can be embedded into the project.

## Usage

The project uses a set of classes for a declarative approach to converting images. The project is based around the `ImageConverter` class and several option classes that can be used.

The `ImageConverter` class can be used with either a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object (web only) or a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) representing the binary data of an image file.

Example usage:

```ts
function convertMyImage(file: File) {
  // Creates a basic image converter
  const converter = new ImageConverter();
  // Converts a JS File object and returns a Uint8Array
  const result = await converter.convertImageFile(file);
  // Afterward, you can do what you want with this byte array,
  // such as streaming it to a server via a Form Post or make
  // a Blob and download it with URL.createObjectURL
  return result;
}
```

Compression options are passed into the `ImageConverter`'s constructor:

```ts
export interface ImageConverterInput {
  compression?: ImageCompressionOptions;
  resize?: ImpageResizeOptions;
  crop?: ImageCropOptions;
  exifData?: Uint8Array;
}
```

The `compression` key is for one of the compression options provided as part of this package. It includes options for compressing the image into a jpeg, png, gif, bpm, tga and tiff.
The `resize` key is for one of the resize options in this package.
The `crop` key is for one of the crop options in this package.
The `exifData` key is for adding exif data to an image. This option should be used in conjunction with extracting exif data.


`ImageConverter` provides two different ways to convert images:

- `convertImageFile(file: File): Promise<Uint8Array<ArrayBufferLike>>`
  - This API accepts a JavaScript File object and runs it through the process (web-only)
- `convertImageBytes(bytes: Uint8Array): Promise<Uint8Array<ArrayBufferLike>>`
  - This API accepts a Uint8Array and does the same thing as `convertImageFile`.

Both APIs return a `Uint8Array` object that can be used in any place where you may want to stream or save files:

- [MDN Sending and Receiving Binary Data](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Sending_and_Receiving_Binary_Data)
- [MDN createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN Using object URLs to display images](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#example_using_object_urls_to_display_images)

## Options

You can specify one of several `CompressionOptions` objects to represent output format and compression:

- `JpegCompressionOptions(quality: number)`
  - Quality represents JPEG image quality. Should be a number between 1-100
- `PngCompressionOptions(quality: number)`
  - Quality represents PNG image quality. Quality above 75 uses `Best` compression and everything else uses `Fast` compression
- `GifCompressionOptions()`
- `BmpCompressionOptions()`
- `TgaCompressionOptions()`
- `TiffCompressionOptions()`

You can specify one of several `ResizeOptions` objects to represent resizing an image:

- `ImageResizeLongestSideOptions(payload: { longest_side: number; })`
  - This operation will find the longest side and resize that side to the provided number. This operation will preserve the aspect ratio.
- `ImageResizeDimensionOptions(payload: { width: number; height: number; })`
  - This will resize the image to the specified width and height. This operation will not preserve the image's aspect ratio and may cause squishing or stretching
- `ImageResizeAspectRatioOptions(payload: { ratio_width: number; ratio_height: number; })`
  - This operation will resize the image to a specific aspect ratio. This operation may cause squishing or stretching

You can specify one of serveral `CropOptions` objects to represent cropping an image:

- `ImageCropDimensionOptions(payload: { x: number; y: number; width: number; height: number; })`
  - This operation sets the x and y position, then defines the width and height of a new image. This operation allows you to defined a sub-picture within the larger picture.
- `ImageCropAspectRatioOptions(payload: { ratio_width: number; ratio_height: number; })`
  - This operation allows you to define a new aspect ratio for an image and crops the image in the center based on this aspect ratio. E.g. you can use 1 for both `ratio_width` and `ratio_height` to define a square and crop a square in the middle of the image
- `ImageCropEachSideOptions(payload: { crop_left: number; crop_right: number; crop_top: number; crop_bottom: number; })`
  - This operation allows you to describe cropping pixels on each of the four sides of the image.

You can specify EXIF data to write to an image using the `exifData` option. This value should be used in conjunction with `extractExifData` to retrieve EXIF data in format that can be used by this option.

Sometimes you want to remove EXIF data, beacuse the output is going to be small (like a thumbnail or avatar) and you want to save as much data as possible. You can pass a `stripExif` option to the `ImageConverter` class in the constructor to strip EXIF data from images.

### EXIF Data

The project also handles EXIF data from images that have some. Currently, this feature only works with jpeg and png images. The `extractExifData` API in the project extracts whatever EXIF data exists in an image and returns the data as a Uint8Array. This array of bytes can then be used to write EXIF data to the newly exported image.

Arbitrary EXIF data cannot be inserted into the image, but any EXIF data can be extracted from images and inserted into others.

Below is an example of extracting EXIF data using the `extractExifData` API and then writing said data to a compressed jpeg.

```ts
const fsp = require("node:fs/promises");
const { extractExifData } = require("@metools/image_converter");

async function getImageExifData() {
  const filepath = 'path/to/file'
  const img = await fsp.readFile(filepath);

  const binaryArray = new Uint8Array(img);

  const imgDat = extractExifData(binaryArray);

  return imgDat; // A Uint8Array of EXIF data
}

/**
 * Receiving image data as a Uint8Array
 */
async function writeImageExifData(imgData: Uint8Array, exifData: Uint8Array) {
  const name = 'new_file_name.jpg';

  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 800,
    }),
    exifData,
  });

  const result = await converter.convertImageBytes(imgData);

  return result;
}
```

## Errors

When the files and binary data provided conform to the file specs of the above supported image formats, the project should work fine. However, if the data provided is NOT an image, `convertImageFile` and `convertImageBytes` will each throw an error. The function should be wrapped in a try / catch block to catch errors.

## Blocking Operation

Running an operation via WebAssmebly is a blocking operation. This means that when the operation is called, it will block a wide variety of tasks in the application from continuing to run, such as UI operations, timers, etc. For instance, when compressing a large image from a DSLR camera, it may take several seconds for the operation to complete and during that time everything else freezes.

As such, for the web, web workers may be a good way to use this package without causing the project to hang:

[MDN Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

In Node, you may want to have the image conversion operation be a separate executable that can run on its own thread. You can probably use `exec` to execute a script.

## Examples

Converting a file to Jpeg:

```ts
function makeMyFileAJpeg(file: File) {
  // Jpeg compression is set to 60. Decent middle ground for
  // quality and size
  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(60),
  });

  const result = await converter.convertImageFile(file);
}
```

Creating a PNG file:

```ts
function makeMyFileAPng(file: File) {
  // Jpeg compression is set to 60. Decent middle ground for
  // quality and size
  const converter = new ImageConverter({
    compression: new PngCompressionOptions(60),
  });

  const result = await converter.convertImageFile(file);
}
```

Using several converters to make several different files:

```ts
function makeImageSet(bin: Uint8Array) {
  const thumb = new ImageConverter({
    compression: new JpegCompressionOptions(40),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 128,
    }),
  });
  const preview = new ImageConverter({
    compression: new JpegCompressionOptions(40),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 256,
    }),
  });
  const image = new ImageConverter({
    compression: new JpegCompressionOptions(60),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 1280,
    }),
  });

  const [thumbResult, previewResult, imageResult] = Promise.all([
    thumb.convertImageBytes(bin),
    preview.convertImageBytes(bin),
    image.convertImageBytes(bin),
  ]);

  // Do what you want
}
```

Cropping an image to a square and resizing for a profile pic

```ts
function makeProfilePic(file: File) {
  const profile = new ImageConverter({
    compression: new JpegCompressionOptions(40),
    crop: new ImageCropAspectRatioOptions({
      ratio_width: 1,
      ratio_height: 1,
    }),
    resize: new ImageResizeLongestSideOptions({
      longest_side: 128,
    }),
  });

  const result = await profile.convertImageFile(file);
}
```
