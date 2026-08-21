import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  workers: 4,
  reporter: "line",
  use: { baseURL: "http://localhost:3000", trace: "on" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
