import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [
      react(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "prokom",
        project: "sentry-demo",
        release: {
          name: `sentry-demo@${env.VITE_RELEASE ?? "0.0.0"}`,
        },
      }),
    ],

    build: {
      sourcemap: true,
    },
  };
});
