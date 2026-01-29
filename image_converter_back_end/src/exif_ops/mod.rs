use std::io::Cursor;

use image::{ImageDecoder, ImageReader};

pub fn get_exif_data(bytes: &[u8]) -> Vec<u8> {
    let mut decoder = get_image_decoder(bytes);

    match decoder.exif_metadata().unwrap() {
        Some(data) => return data,
        None => return Vec::new(),
    };
}

fn get_image_decoder<'a>(bytes: &'a [u8]) -> impl ImageDecoder + 'a {
    let reader = ImageReader::new(Cursor::new(bytes))
        .with_guessed_format()
        .unwrap();

    let decoder_raw = reader.into_decoder();

    let decoder = match decoder_raw {
        Ok(v) => v,
        Err(_) => {
            panic!();
        }
    };

    return decoder;
}
