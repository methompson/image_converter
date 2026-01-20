use std::io::Cursor;

use image::{
    codecs::{
        jpeg::JpegEncoder,
        png::{CompressionType, FilterType, PngEncoder},
        tiff::TiffEncoder,
    },
    DynamicImage, ImageEncoder, ImageFormat,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

pub enum ImageType {
    Png,
    Jpeg,
    Gif,
    Bmp,
    Tga,
    Tiff,
}

#[derive(Serialize, Deserialize)]
pub struct CompressionOptionsInput {
    pub format: Option<String>,
    pub quality: Option<f64>,
}

pub struct CompressionOptions {
    pub format: ImageType,
    pub quality: u32,
}

const DEFAULT_IMAGE_QUALITY: u32 = 64;
const DEFAULT_IMAGE_TYPE: ImageType = ImageType::Jpeg;

fn parse_options_input(input: JsValue) -> Option<CompressionOptionsInput> {
    let opts: CompressionOptionsInput = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(opts);
}

pub fn parse_compression_options(input: JsValue) -> CompressionOptions {
    let inputs = parse_options_input(input);

    match inputs {
        Some(opts) => {
            let format = match opts.format {
                Some(format_raw) => match format_raw.as_str() {
                    "png" => ImageType::Png,
                    "jpg" => ImageType::Jpeg,
                    "jpeg" => ImageType::Jpeg,
                    "gif" => ImageType::Gif,
                    "bmp" => ImageType::Bmp,
                    "tiff" => ImageType::Tiff,
                    "tif" => ImageType::Tiff,
                    "tga" => ImageType::Tga,
                    "targa" => ImageType::Tga,
                    _ => DEFAULT_IMAGE_TYPE,
                },
                None => DEFAULT_IMAGE_TYPE,
            };

            let quality = match opts.quality {
                Some(quality_raw) => {
                    if quality_raw > 100.0 || quality_raw < 0.0 {
                        DEFAULT_IMAGE_QUALITY as u32
                    } else {
                        quality_raw as u32
                    }
                }
                None => DEFAULT_IMAGE_QUALITY,
            };

            return CompressionOptions {
                format: format,
                quality: quality,
            };
        }
        None => {
            return CompressionOptions {
                format: DEFAULT_IMAGE_TYPE,
                quality: DEFAULT_IMAGE_QUALITY,
            }
        }
    }
}

pub fn write_image(
    image: &DynamicImage,
    opts: &CompressionOptions,
    exif_data: Option<Vec<u8>>,
) -> Vec<u8> {
    let mut dat: Vec<u8> = Vec::new();

    match opts.format {
        ImageType::Bmp => {
            image
                .write_to(&mut Cursor::new(&mut dat), ImageFormat::Bmp)
                .unwrap();
        }
        ImageType::Gif => {
            image
                .write_to(&mut Cursor::new(&mut dat), ImageFormat::Gif)
                .unwrap();
        }
        ImageType::Jpeg => {
            let mut encoder = JpegEncoder::new_with_quality(&mut dat, opts.quality as u8);

            if exif_data.is_some() {
                let _ = encoder.set_exif_metadata(exif_data.unwrap());
            }

            image.write_with_encoder(encoder).unwrap();
        }
        ImageType::Png => {
            let compression = if opts.quality > 75 {
                CompressionType::Best
            } else {
                CompressionType::Fast
            };

            let mut encoder =
                PngEncoder::new_with_quality(&mut dat, compression, FilterType::Adaptive);

            if exif_data.is_some() {
                let _ = encoder.set_exif_metadata(exif_data.unwrap());
            }

            image.write_with_encoder(encoder).unwrap();
        }
        ImageType::Tiff => {
            let mut encoder = TiffEncoder::new(Cursor::new(&mut dat));

            if exif_data.is_some() {
                let _ = encoder.set_exif_metadata(exif_data.unwrap());
            }

            image
                .write_to(&mut Cursor::new(&mut dat), ImageFormat::Tiff)
                .unwrap();
        }
        ImageType::Tga => {
            image
                .write_to(&mut Cursor::new(&mut dat), ImageFormat::Tga)
                .unwrap();
        }
    }

    return dat;
}

pub fn default_compression_options() -> CompressionOptions {
    return CompressionOptions {
        format: DEFAULT_IMAGE_TYPE,
        quality: DEFAULT_IMAGE_QUALITY,
    };
}
