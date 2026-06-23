import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // `server-only` throws when imported outside an RSC bundle; stub it for
      // the node test runner. The real guard still applies in `next build`.
      "server-only": fileURLToPath(
        new URL("./src/test/empty-module.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
  },
});
