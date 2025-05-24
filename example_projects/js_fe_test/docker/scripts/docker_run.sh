(
  cd docker && \
  docker run \
  --rm \
  -p 3000:80 \
  --name wasm-test \
  wasm-test
)