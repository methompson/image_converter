pub mod compress;
pub mod crop;
pub mod resize;

use compress::{default_compression_options, parse_compression_options, CompressionOptions};
use crop::{parse_crop_options, CropOptions};
use resize::{parse_resize_options, ResizeOptions};
// use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

// #[derive(Serialize, Deserialize)]
// enum StringOrNumber {
//     String(String),
//     Number(u32),
// }

pub struct ImageOperationOptions {
    pub crop_options: Option<CropOptions>,
    pub resize_options: Option<ResizeOptions>,
    pub compression_options: CompressionOptions,
    pub exif_data: Option<Vec<u8>>,
}

pub fn parse_image_options(input: JsValue) -> ImageOperationOptions {
    if !input.is_object() {
        return ImageOperationOptions {
            crop_options: None,
            resize_options: None,
            compression_options: default_compression_options(),
            exif_data: None,
        };
    }

    let crop_options_raw = js_sys::Reflect::get(&input, &JsValue::from_str("cropOptions")).unwrap();
    let crop_options = parse_crop_options(crop_options_raw);

    let resize_options_raw =
        js_sys::Reflect::get(&input, &JsValue::from_str("resizeOptions")).unwrap();
    let resize_options = parse_resize_options(resize_options_raw);

    let compression_options_raw =
        js_sys::Reflect::get(&input, &JsValue::from_str("compressionOptions")).unwrap();
    let compression_options = parse_compression_options(compression_options_raw);

    let exif_options_raw = js_sys::Reflect::get(&input, &JsValue::from_str("exifData")).unwrap();
    let exif_options: Option<Vec<u8>> = serde_wasm_bindgen::from_value(exif_options_raw).ok();

    ImageOperationOptions {
        crop_options: crop_options,
        resize_options: resize_options,
        compression_options: compression_options,
        exif_data: exif_options,
    }
}
