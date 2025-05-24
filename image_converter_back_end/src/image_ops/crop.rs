use image::DynamicImage;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

#[derive(Serialize, Deserialize)]
pub struct CropDimensions {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct CropAspectRatio {
    pub ratio_width: u32,
    pub ratio_height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct CropEachSide {
    pub crop_left: u32,
    pub crop_right: u32,
    pub crop_top: u32,
    pub crop_bottom: u32,
}

pub enum CropOptions {
    CropDimensions(CropDimensions),
    CropAspectRatio(CropAspectRatio),
    CropEachSide(CropEachSide),
}

fn parse_crop_dimensions(input: JsValue) -> Option<CropOptions> {
    let opts: CropDimensions = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(CropOptions::CropDimensions(opts));
}

fn parse_crop_each_side(input: JsValue) -> Option<CropOptions> {
    let opts: CropEachSide = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(CropOptions::CropEachSide(opts));
}

fn parse_crop_aspect_ratio(input: JsValue) -> Option<CropOptions> {
    let crop_aspect_ratio: CropAspectRatio = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(CropOptions::CropAspectRatio(crop_aspect_ratio));
}

pub fn parse_crop_options(input: JsValue) -> Option<CropOptions> {
    // Escape hatch
    if !input.is_object() {
        return None;
    }

    // Check if the input is a CropDimensions object
    let dim_opt_raw = parse_crop_dimensions(input.clone());
    if dim_opt_raw.is_some() {
        return dim_opt_raw;
    }

    // Check if the input is a CropAspectRatio object
    let ar_opt_raw = parse_crop_aspect_ratio(input.clone());
    if ar_opt_raw.is_some() {
        return ar_opt_raw;
    }

    let each_side_opt_raw = parse_crop_each_side(input.clone());
    if each_side_opt_raw.is_some() {
        return each_side_opt_raw;
    }

    return None;
}

fn convert_ar_opts_to_crop_dimensions(
    img: &DynamicImage,
    crop_aspect_ratio: &CropAspectRatio,
) -> CropDimensions {
    let img_width = img.width() as f64;
    let img_height = img.height() as f64;
    let ar = crop_aspect_ratio.ratio_width as f64 / crop_aspect_ratio.ratio_height as f64;

    // Square AR
    let mut new_height = if img_width > img_height {
        img_height
    } else {
        img_width
    };
    let mut new_width = new_height;

    // Portrait AR
    if ar < 1.0 {
        new_height = img_height as f64;
        new_width = img_height as f64 * ar;
    // Landscape AR
    } else if ar > 1.0 {
        new_width = img_width as f64;
        new_height = img_width as f64 / ar;
    }

    let x_crop = img_width - new_width;
    let y_crop = img_height - new_height;

    // Center crop
    let x = x_crop / 2.0;
    let width = img_width - x_crop;
    let y = y_crop / 2.0;
    let height = img_height - y_crop;

    CropDimensions {
        x: x as u32,
        y: y as u32,
        width: width as u32,
        height: height as u32,
    }
}

fn convert_each_side_opts_to_crop_dimensions(
    img: &DynamicImage,
    crop_each_side: &CropEachSide,
) -> CropDimensions {
    let width = img.width();
    let height = img.height();

    let new_width = width - crop_each_side.crop_left - crop_each_side.crop_right;
    let new_height = height - crop_each_side.crop_top - crop_each_side.crop_bottom;

    CropDimensions {
        x: crop_each_side.crop_left,
        y: crop_each_side.crop_top,
        width: new_width,
        height: new_height,
    }
}

pub fn crop_image(img: &DynamicImage, options: &CropOptions) -> DynamicImage {
    let options: &CropDimensions = match options {
        CropOptions::CropDimensions(opt) => opt,
        CropOptions::CropAspectRatio(crop) => &convert_ar_opts_to_crop_dimensions(&img, crop),
        CropOptions::CropEachSide(crop) => &convert_each_side_opts_to_crop_dimensions(&img, crop),
    };

    let output: DynamicImage = img.crop_imm(options.x, options.y, options.width, options.height);
    return output;
}
