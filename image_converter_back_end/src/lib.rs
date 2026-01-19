mod exif_ops;
mod image_ops;
mod read_image;

use std::io::Cursor;

use image::DynamicImage;
use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;

use exif_ops::{read_image_exif, write_image_exif};

use image_ops::{
    compress::write_image, crop::crop_image, parse_image_options, resize::resize_image,
};
use read_image::read_image_bytes;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

#[wasm_bindgen]
pub fn process_image(bytes: &[u8], input: JsValue) -> Uint8Array {
    let buff = Cursor::new(bytes);

    let image_result = read_image_bytes(buff);
    let image = match image_result {
        Ok(result) => result,
        Err(err) => {
            error(format!("Error Opening Image: {:?}", err).as_str());
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

    let image = write_image(&resized_image, image_ops.compression_options);

    let final_image: Vec<u8> = match &image_ops.exif_data {
        Some(exif_data) => write_image_exif(image, exif_data),
        None => image,
    };

    return Uint8Array::from(final_image.as_slice());
}

#[wasm_bindgen]
pub fn get_image_exif_data(bytes: &[u8]) -> Uint8Array {
    let result = read_image_exif(bytes);

    return Uint8Array::from(result.as_slice());
}
