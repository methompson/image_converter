use image::DynamicImage;

use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

#[derive(Serialize, Deserialize)]
pub struct ResizeDimensions {
    pub width: u32,
    pub height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ResizeAspectRatio {
    pub ratio_width: u32,
    pub ratio_height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ResizeLongestSide {
    pub longest_side: u32,
}

pub enum ResizeOptions {
    ResizeDimensions(ResizeDimensions),
    ResizeAspectRatio(ResizeAspectRatio),
    ResizeLongestSide(ResizeLongestSide),
}

fn parse_resize_dimensions(input: JsValue) -> Option<ResizeOptions> {
    let opts: ResizeDimensions = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(ResizeOptions::ResizeDimensions(opts));
}

fn parse_resize_aspect_ratio(input: JsValue) -> Option<ResizeOptions> {
    let resize_aspect_ratio: ResizeAspectRatio = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(ResizeOptions::ResizeAspectRatio(resize_aspect_ratio));
}

fn parse_resize_longest_side(input: JsValue) -> Option<ResizeOptions> {
    let resize_longest_side: ResizeLongestSide = serde_wasm_bindgen::from_value(input).ok()?;
    return Some(ResizeOptions::ResizeLongestSide(resize_longest_side));
}

pub fn parse_resize_options(input: JsValue) -> Option<ResizeOptions> {
    // Escape hatch
    if !input.is_object() {
        return None;
    }

    // Check if the input is a ResizeDimensions object
    let resize_dim = parse_resize_dimensions(input.clone());
    if resize_dim.is_some() {
        return resize_dim;
    }

    // Check if the input is a ResizeAspectRatio object
    let resize_ar = parse_resize_aspect_ratio(input.clone());
    if resize_ar.is_some() {
        return resize_ar;
    }

    // Check if the input is a ResizeLongestSide object
    let each_side_opt_raw = parse_resize_longest_side(input.clone());
    if each_side_opt_raw.is_some() {
        return each_side_opt_raw;
    }

    return None;
}

pub fn convert_ar_to_dimensions(
    img: &DynamicImage,
    resize_opts: &ResizeAspectRatio,
) -> ResizeDimensions {
    let ar = resize_opts.ratio_width as f64 / resize_opts.ratio_height as f64;

    let img_width = img.width() as f64;
    let img_height = img.height() as f64;

    let mut new_width = img_width;
    let mut new_height = img_height;

    if ar > 1.0 {
        new_height = img_width / ar;
    } else if ar < 1.0 {
        new_width = img_height * ar;
    } else {
        let shortest_side = if img_width > img_height {
            img_height
        } else {
            img_width
        };
        new_width = shortest_side;
        new_height = shortest_side;
    }

    return ResizeDimensions {
        width: new_width as u32,
        height: new_height as u32,
    };
}

pub fn resize_image(img: &DynamicImage, resize_opts: &ResizeOptions) -> DynamicImage {
    let options: &ResizeDimensions = match resize_opts {
        ResizeOptions::ResizeDimensions(opts) => opts,
        ResizeOptions::ResizeAspectRatio(opts) => &convert_ar_to_dimensions(img, opts),
        ResizeOptions::ResizeLongestSide(opts) => {
            let longest_side = opts.longest_side;
            return img.resize(longest_side, longest_side, image::imageops::Lanczos3);
        }
    };

    let output = img.resize_exact(options.width, options.height, image::imageops::Lanczos3);
    return output;
}
