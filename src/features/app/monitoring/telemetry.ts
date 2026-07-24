import * as Sentry from "@sentry/react";

interface TelemetryPayload {
  [key: string]: string | number | boolean | null | undefined;
}

let sentryEnabled = false;
let gaEnabled = false;
let initialized = false;

function canLogDebug(): boolean {
  return import.meta.env.DEV && import.meta.env.MODE !== "test";
}

function createCorrelationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `err_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function asError(err: unknown): Error {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error");
}

function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || import.meta.env.MODE === "test") return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    enabled: true,
    tracesSampleRate: 0.2
  });

  sentryEnabled = true;
}

function initGoogleAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || typeof window === "undefined") return;

  if ((window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    gaEnabled = true;
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  const inline = document.createElement("script");
  inline.text = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag = gtag;",
    `gtag('js', new Date());`,
    `gtag('config', '${measurementId}', { send_page_view: false });`
  ].join("\n");
  document.head.appendChild(inline);

  gaEnabled = true;
}

export function initializeTelemetry() {
  if (initialized || import.meta.env.MODE === "test") return;

  initSentry();
  initGoogleAnalytics();

  window.addEventListener("error", (event) => {
    captureError(event.error ?? event.message, { source: "window.error" });
  });

  window.addEventListener("unhandledrejection", (event) => {
    captureError(event.reason, { source: "window.unhandledrejection" });
  });

  initialized = true;
}

export function captureError(error: unknown, payload: TelemetryPayload = {}): string {
  const correlationId = createCorrelationId();
  const extra = {
    ...payload,
    correlation_id: correlationId
  };

  if (sentryEnabled) {
    Sentry.captureException(asError(error), {
      extra,
      tags: {
        correlation_id: correlationId
      }
    });
  }

  if (canLogDebug()) {
    console.error("[telemetry:error]", error, extra);
  }

  return correlationId;
}

export function captureRecoverableError(
  error: unknown,
  triggerNotification: (message: string) => void,
  context: string,
  userMessage = "Something went wrong. Please try again."
): string {
  const correlationId = captureError(error, {
    context,
    recoverable: true
  });
  const shortRef = correlationId.slice(0, 8);
  triggerNotification(`${userMessage} Ref: ${shortRef}`);
  return correlationId;
}

export function trackEvent(name: string, payload: TelemetryPayload = {}) {
  if (gaEnabled) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", name, payload);
  }

  if (sentryEnabled) {
    Sentry.addBreadcrumb({
      category: "analytics",
      level: "info",
      message: name,
      data: payload
    });
  }

  if (canLogDebug()) {
    console.info("[telemetry:event]", name, payload);
  }
}

export function trackScreenView(screenName: string) {
  trackEvent("screen_view", { screen_name: screenName });
}
