import posthog from 'posthog-js';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: "https://2c0666d37a512e3ff84c3f8b9a83a016@o4511185606410240.ingest.de.sentry.io/4511185631576144",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  sendDefaultPii: true,
});

posthog.init("phc_CEaawL384zYxVKk39r8Cqe8RWaRqWRWRKnF6ajyLS5F3", {
  api_host: "https://eu.i.posthog.com",
  ui_host: "https://eu.posthog.com",

  capture_pageview: true,
  persistence: "localStorage",
});

posthog.identify(posthog.get_distinct_id());
posthog.reloadFeatureFlags();

window.posthog = posthog;