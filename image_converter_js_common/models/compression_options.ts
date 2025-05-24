interface CompressionOptions {
  format: string;
  quality?: number;
}

export abstract class ImageCompressionOptions {
  abstract get optionExport(): CompressionOptions;
}

export class JpegCompressionOptions extends ImageCompressionOptions {
  quality: number;

  constructor(quality: number) {
    super();

    if (quality < 0 || quality > 100) {
      throw new Error('Quality must be between 0 and 100');
    }

    this.quality = quality;
  }

  get optionExport(): CompressionOptions {
    return {
      format: 'jpeg',
      quality: this.quality,
    };
  }
}

export class PngCompressionOptions extends ImageCompressionOptions {
  quality: number;

  constructor(quality: number) {
    super();

    if (quality < 0 || quality > 9) {
      throw new Error('Compression level must be between 0 and 9');
    }

    this.quality = quality;
  }

  get optionExport(): CompressionOptions {
    return {
      format: 'png',
      quality: this.quality,
    };
  }
}

export class GifCompressionOptions extends ImageCompressionOptions {
  get optionExport(): CompressionOptions {
    return { format: 'gif' };
  }
}

export class BmpCompressionOptions extends ImageCompressionOptions {
  get optionExport(): CompressionOptions {
    return { format: 'bmp' };
  }
}

export class TgaCompressionOptions extends ImageCompressionOptions {
  get optionExport(): CompressionOptions {
    return { format: 'tga' };
  }
}

export class TiffCompressionOptions extends ImageCompressionOptions {
  get optionExport(): CompressionOptions {
    return { format: 'tiff' };
  }
}
