import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      // Allow serving files from one level up to the project root
      allow: [
        "../../image_converter_web_library/dist",
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
  },
  optimizeDeps: {
    exclude: ["@metools/web-image-converter"],
  },
});
