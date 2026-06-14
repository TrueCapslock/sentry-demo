import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

// Sentry.init({
//   dsn: "https://52d8a2a7c48548bf989d64c64b3085c8@glitchtip.backstage.prokom.no/2",
//   environment: import.meta.env.MODE,
//   release: `sentry-demo@${import.meta.env.VITE_RELEASE ?? "0.0.0"}`,
//   integrations: [Sentry.browserTracingIntegration()],
//   enableLogs: true,
//   tracesSampleRate: 1.0,
// });

Sentry.init({
  dsn: "https://1966b0f67a725c2b1601d2af52f9f5eb@o4508376266309632.ingest.de.sentry.io/4511564169478224",
  environment: import.meta.env.MODE,
  release: `sentry-demo@${import.meta.env.VITE_RELEASE ?? "0.0.0"}`,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    Sentry.feedbackIntegration({
      colorScheme: "dark",
      showBranding: false,
      isEmailRequired: false,
      autoInject: false,
    }),
  ],
  // debug: true,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
