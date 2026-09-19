import vue from "@vitejs/plugin-vue";
import defineRender from "@vue-macros/define-render/vite";
import { websitePublicDir, websiteResolve } from "./packages/website/vite.shared.ts";
import { browserLogFilter } from "./scripts/browser-log-filter.ts";
import { createPlaywrightProvider } from "./scripts/browser-provider.ts";

export default {
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  publicDir: websitePublicDir,
  plugins: [browserLogFilter, vue(), defineRender()],
  resolve: websiteResolve,
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["packages/vue-clamp/tests/**/*.browser.benchmark.ts"],
    fileParallelism: false,
    testTimeout: 120000,
    browser: {
      locators: {
        // Vitest v4 compatibility: keep partial, case-insensitive locator matching.
        // Remove after updating locators for full, case-sensitive matches.
        // https://vitest.dev/guide/migration/#locators-are-strict-by-default
        exact: false,
      },
      enabled: true,
      provider: createPlaywrightProvider(),
      headless: true,
      ui: false,
      screenshotFailures: false,
      viewport: {
        width: 1280,
        height: 900,
      },
      instances: [{ browser: "chromium" }],
    },
  },
};
