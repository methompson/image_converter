mod exif_ops;
mod image_ops;
mod logging;
mod read_image;

use std::io::Cursor;

use image::DynamicImage;
use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;

use image_ops::{
    compress::write_image, crop::crop_image, parse_image_options, resize::resize_image,
};
use read_image::read_image_bytes;

use crate::exif_ops::get_exif_data;

use logging::js_error;

#[wasm_bindgen]
pub fn process_image(bytes: &[u8], input: JsValue) -> Uint8Array {
    let buff = Cursor::new(bytes);

    let image_result = read_image_bytes(buff);
    let image = match image_result {
        Ok(result) => result,
        Err(err) => {
            js_error(format!("Error Opening Image: {:?}", err).as_str());
            panic!();
        }
    };

    let image_ops = parse_image_options(input);

    let cropped_image: DynamicImage = match &image_ops.crop_options {
        Some(crop) => crop_image(&image, crop),
        None => image,
    };

    let resized_image: DynamicImage = match &image_ops.resize_options {
        Some(resize) => resize_image(&cropped_image, resize),
        None => cropped_image,
    };

    let strip_exif = match image_ops.strip_exif {
        Some(v) => v,
        None => false,
    };

    let mut exif_data: Option<Vec<u8>> = None;
    if !strip_exif && image_ops.exif_data.is_none() {
        exif_data = Some(get_exif_data(bytes));
    } else if image_ops.exif_data.is_some() {
    }

    let image = write_image(&resized_image, &image_ops.compression_options, exif_data);

    return Uint8Array::from(image.as_slice());
}

#[wasm_bindgen]
pub fn get_image_exif_data(bytes: &[u8]) -> Uint8Array {
    let result = get_exif_data(bytes);

    return Uint8Array::from(result.as_slice());
}

#[wasm_bindgen]
pub fn get_image_dimensions(bytes: &[u8]) -> JsValue {
    let buff = Cursor::new(bytes);

    let image_result = read_image_bytes(buff);
    let image = match image_result {
        Ok(result) => result,
        Err(err) => {
            js_error(format!("Error Opening Image: {:?}", err).as_str());
            panic!();
        }
    };

    let width = image.width();
    let height = image.height();

    let dimensions = js_sys::Object::new();
    js_sys::Reflect::set(
        &dimensions,
        &JsValue::from_str("width"),
        &JsValue::from_f64(width as f64),
    )
    .unwrap();
    js_sys::Reflect::set(
        &dimensions,
        &JsValue::from_str("height"),
        &JsValue::from_f64(height as f64),
    )
    .unwrap();

    return JsValue::from(dimensions);
}
