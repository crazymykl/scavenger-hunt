import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { codecovVitePlugin } from "@codecov/vite-plugin"

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
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
    reporters: ["junit"],
    outputFile: "test-report.junit.xml",
    coverage: {
      provider: "v8",
      include: ["src"],
      exclude: ["src/main.tsx"],
    },
  },
})
