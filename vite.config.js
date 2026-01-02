// This is used to compile server-side code.
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    rollupOptions: {
      input: {
        server: "server.ts",
      },
      external: ["node:events"],
    },
  },
  esbuild: {
    target: "es2022",
    supported: {
      decorators: true,
    },
  },
});
