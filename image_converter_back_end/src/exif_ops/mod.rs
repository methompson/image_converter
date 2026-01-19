use img_parts::{jpeg::Jpeg, Bytes, ImageEXIF};

pub fn read_image_exif(bytes_arr: &[u8]) -> Vec<u8> {
    let image_bytes = Bytes::from(bytes_arr.to_vec());
    let img_data = Jpeg::from_bytes(image_bytes).unwrap();

    let exif = img_data.exif().unwrap();
    let exif_vec: Vec<u8> = exif.to_vec();

    return exif_vec;
}

pub fn write_image_exif(image_vec: Vec<u8>, exif_data: &[u8]) -> Vec<u8> {
    let image_bytes = Bytes::from(image_vec);
    let mut img_data = Jpeg::from_bytes(image_bytes).unwrap();

    let exif_bytes = Bytes::from(exif_data.to_vec());

    img_data.set_exif(Some(exif_bytes));

    let mut buffer: Vec<u8> = Vec::new();

    img_data.encoder().write_to(&mut buffer).unwrap();

    return buffer;
}
