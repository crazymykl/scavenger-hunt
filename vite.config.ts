import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { codecovVitePlugin } from "@codecov/vite-plugin"

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "scavenger-hunt",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  optimizeDeps: {
    exclude: ["@undecaf/zbar-wasm"],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "src/setupTests",
    mockReset: true,
    reporters: ["default", "junit"],
    outputFile: "test-report.junit.xml",
    coverage: {
      provider: "v8",
      include: ["src"],
      exclude: ["src/main.tsx", "src/admin.tsx", "src/setupTests.ts"],
    },
  },
})
