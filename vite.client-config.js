// This is used to compile client-side code.
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "hello-world.ts",
      formats: ["es"],
    },
  },
  esbuild: {
    target: "es2022",
    supported: {
      decorators: true,
    },
  },
});
