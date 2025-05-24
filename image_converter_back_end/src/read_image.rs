use std::io::Cursor;

use image::{DynamicImage, ImageError, ImageReader};

pub fn read_image_bytes(bytes: Cursor<&[u8]>) -> Result<DynamicImage, ImageError> {
    let image = ImageReader::new(bytes).with_guessed_format()?.decode()?;

    return Ok(image);
}
