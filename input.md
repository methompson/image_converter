function image input:

- Image binary data (uint8 array?)
- Optional Image output format & compression
- Optional image resize settings
- Optional Image cropping settings

Image output format

- image type, i.e. 'jpeg'
- Compression quality (some number 0-10 or 0-100)
- By Default, we'll pick something arbitrary, e.g. jpeg & 60% compression?

Resize Settings

- Proportional sizing with longest size
- Proportional sizing with longest width or height, whichever is smaller
- Absolute resizing without maintaining aspect ratio

Crop Settings

- cropping (in px) on all 4 sides
- cropping to a specific aspect ratio
