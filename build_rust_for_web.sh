./build_web.sh

rm -rf image_converter_web_library/src/image_converter_binary
cp -r image_converter_back_end/pkg image_converter_web_library/src/image_converter_binary

rm image_converter_web_library/src/image_converter_binary/README.md
rm image_converter_web_library/src/image_converter_binary/package.json