import vue from "@vitejs/plugin-vue";
import defineRender from "@vue-macros/define-render/vite";
import { websiteCodeHighlightPlugin } from "./packages/website/vite.highlight.ts";
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
  plugins: [browserLogFilter, websiteCodeHighlightPlugin(), vue(), defineRender()],
  resolve: websiteResolve,
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-1-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["packages/vue-clamp/tests/**/*.browser.test.ts"],
    fileParallelism: false,
    testTimeout: 30000,
    browser: {
      locators: {
        // Vitest v4 compatibility: keep partial, case-insensitive locator matching.
        // Remove after updating locators for full, case-sensitive matches.
        // https://release-v1-0-0-rc-1-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
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
