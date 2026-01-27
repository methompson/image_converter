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

### Compressing an Image

Compressing an image is handled by the `ImageConverter` class. The Image Converter class accepts several inputs as part of its input to configure  what kind of image you'll output. You can tailor eac instance of an `ImageConverter` to perform specific tasks.

Each `ImageConverter` has its own option set up. You can readily configure each `ImageConverter` instance to have several different options that will remain after instantiation. You can configure each instance with different compression, resize, cropping and exif options.

```ts
// Compresses an image input to a jpeg with quality 75 and the longest side is 800px
const webSize = new ImageConverter({
  compression: new JpegCompressionOptions(75),
  resize: new ImageResizeLongestSideOptions({
    longestSide: 800,
  }),
});

// Compresses an image input to a jpeg with quality 60 and the longest side is 128px. Cropped down to a square
const thumbSize = new ImageConverter({
  compression: new JpegCompressionOptions(60),
  resize: new ImageResizeLongestSideOptions({
    longestSide: 128,
  }),
  crop: new ImageCropAspectRatioOptions({
    ratioHeight: 1,
    ratioWidth: 1,
  }),
  stripExif: true,
});
```

The `ImageConverter` instance has the following inputs for its constructor:

```ts
export interface ImageConverterInput {
  compression?: ImageCompressionOptions;
  resize?: ImpageResizeOptions;
  crop?: ImageCropOptions;
  stripExif?: boolean;
}

new ImageConverter(payload: ImageConverterInput);
```

`compression` refers to the type of compression that will be used to create the new images. The default is jpeg compression at 75.
`resize` refers to how the converter will resize image. The default is no resize.
`crop` refers to how the image gets cropped. The default is no crop.
`stripExif` determines if EXIF data gets stripped from the image. The default is to keep EXIF data.

### Compressing an image

There are several image formats that the user can select for compressing an image:

```ts
// Quality represents JPEG image quality. Should be a number between 1-100
JpegCompressionOptions(quality: number)
// Quality represents PNG image quality. Quality above 75 uses `Best` compression and everything else uses `Fast` compression
PngCompressionOptions(quality: number)
GifCompressionOptions()
BmpCompressionOptions()
TgaCompressionOptions()
TiffCompressionOptions()
```

Only jpeg and png formats currently support user defined compression quality.

### Resizing an Image

There are 3 different types of Resize operations.

```ts
// This operation will find the longest side and resize that side to the provided number. This operation will preserve the aspect ratio.
ImageResizeLongestSideOptions(payload: { longestSide: number; })
// This will resize the image to the specified width and height. This operation will not preserve the image's aspect ratio and may cause squishing or stretching
ImageResizeDimensionOptions(payload: { width: number; height: number; })
// This operation will resize the image to a specific aspect ratio. This operation may cause squishing or stretching
ImageResizeAspectRatioOptions(payload: { ratioWidth: number; ratioHeight: number; })
```

### Cropping an Image

There are 3 different types of crop options.

```ts
// This operation sets the x and y position, then defines the width and height of a new image. This operation allows you to defined a sub-picture within the larger picture.
ImageCropDimensionOptions(payload: { x: number; y: number; width: number; height: number; })
// This operation allows you to define a new aspect ratio for an image and crops the image in the center based on this aspect ratio. E.g. you can use 1 for both `ratioWidth` and `ratioHeight` to define a square and crop a square in the middle of the image
ImageCropAspectRatioOptions(payload: { ratioWidth: number; ratioHeight: number; })
// This operation allows you to describe cropping pixels on each of the four sides of the image.
ImageCropEachSideOptions(payload: { cropLeft: number; cropRight: number; cropTop: number; cropBottom: number; })
```

### EXIF Data

Exif data can be stripped by the conversion process. This can save a few bytes of data, which is important when compression photographs down to small thumbnails. In the `ImageConverter` class, you can pass the `stripExif : true` value in the options. This will remove EXIF data from the image if any exists.

The library also contains an API to retrieve EXIF data from the image. Currently, this API only export EXIF data as a `Uint8Array` binary format. Its purpose is to be able to write the data back into an image or transfer from one image to another.

```ts
extractExifData = (bytes: Uint8Array) => Uint8Array;
```

Example usage:

```ts
import {
  extractExifData,
  ImageConverter,
  ImageResizeLongestSideOptions,
  JpegCompressionOptions,
} from '@metools/web-image-converter'

async function processImage(file: File) {
  const buf = await file.arrayBuffer();
  const fileBytes new Uint8Array(buf);

  const exifData = extractExifData(fileBytes);

  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({
      longestSide: 800,
    }),
  });

  // New Image in Uint8Array format with the exifData written.
  const result = await converter.convertImageBytes(data, {
    exifData,
  });
}

```

### Image Dimensions

The image's dimensions can also be had with one of the APIs in the project.

```ts
getImageDimensions: (bytes: Uint8Array) => { width: number, height: number }
```

Example usage:

```ts
const { getImageDimensions } = require("image_converter");

async function getDimensions(file: Uint8Array) {
  // In Object format
  const dimensions = await getImageDimensions(imgData);
}
```

## Errors

When the files and binary data provided conform to the file specs of the above supported image formats, the project should work fine. However, if the data provided is NOT an image, `convertImageFile` and `convertImageBytes` will each throw an error. The function should be wrapped in a try / catch block to catch errors.

## Blocking Operation

Running an operation via WebAssmebly is a blocking operation. This means that when the operation is called, it will block a wide variety of tasks in the application from continuing to run, such as UI operations, timers, etc. For instance, when compressing a large image from a DSLR camera, it may take several seconds for the operation to complete and during that time everything else freezes.

As such, for the web, web workers may be a good way to use this package without causing the project to hang:

[MDN Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

In Node, you may want to have the image conversion operation be a separate executable that can run on its own thread. You can probably use `exec` to execute a script.

## More Examples

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
      longestSide: 128,
    }),
  });
  const preview = new ImageConverter({
    compression: new JpegCompressionOptions(40),
    resize: new ImageResizeLongestSideOptions({
      longestSide: 256,
    }),
  });
  const image = new ImageConverter({
    compression: new JpegCompressionOptions(60),
    resize: new ImageResizeLongestSideOptions({
      longestSide: 1280,
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
      ratioWidth: 1,
      ratioHeight: 1,
    }),
    resize: new ImageResizeLongestSideOptions({
      longestSide: 128,
    }),
  });

  const result = await profile.convertImageFile(file);
}
```
