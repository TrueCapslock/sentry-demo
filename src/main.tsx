import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

const SENTRY_DSN = "https://1966b0f67a725c2b1601d2af52f9f5eb@o4508376266309632.ingest.de.sentry.io/4511564169478224";

const GLITCHTIP_STORE = "https://glitchtip.backstage.prokom.no/api/2/store/";
const GLITCHTIP_AUTH = "Sentry sentry_version=7, sentry_key=52d8a2a7c48548bf989d64c64b3085c8";

function forwardToGlitchtip(event: Sentry.Event) {
  fetch(GLITCHTIP_STORE + `?sentry_key=52d8a2a7c48548bf989d64c64b3085c8`, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
      "X-Sentry-Auth": GLITCHTIP_AUTH,
    },
  }).catch(() => { /* GlitchTip unavailable — not critical */ })
  return event
}

Sentry.init({
  dsn: SENTRY_DSN,
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
  beforeSend: forwardToGlitchtip as any,
  beforeSendTransaction: forwardToGlitchtip as any,
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
