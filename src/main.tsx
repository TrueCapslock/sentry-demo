import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? "";

const GLITCHTIP_DSN = import.meta.env.VITE_GLITCHTIP_DSN ?? "";

function getGlitchtipStore(dsn: string) {
  try {
    const url = new URL(dsn);
    const key = url.username;
    const projectId = dsn.split("/").pop();
    if (!key || !projectId) return { store: "", key: "" };
    return { store: `${url.protocol}//${url.host}/api/${projectId}/store/`, key };
  } catch {
    return { store: "", key: "" };
  }
}

const { store: GLITCHTIP_STORE, key: GLITCHTIP_KEY } = getGlitchtipStore(GLITCHTIP_DSN);

function safeJsonify(obj: unknown): string {
  const seen = new WeakSet()
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]"
      seen.add(value)
    }
    return value
  })
}

function forwardToGlitchtip(event: Sentry.Event) {
  if (!GLITCHTIP_STORE || !GLITCHTIP_KEY) return event
  if (!event.exception && !event.message) return event
  fetch(`${GLITCHTIP_STORE}?sentry_key=${GLITCHTIP_KEY}`, {
    method: "POST",
    body: safeJsonify(event),
    headers: {
      "Content-Type": "application/json",
      "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${GLITCHTIP_KEY}`,
    },
  }).catch(() => {})
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
  beforeSend: (e) => forwardToGlitchtip(e) as any,
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
