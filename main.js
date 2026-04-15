import posthog from 'posthog-js';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  sendDefaultPii: true,
  tunnel: '/sentry-tunnel',
});

posthog.init("phc_CEaawL384zYxVKk39r8Cqe8RWaRqWRWRKnF6ajyLS5F3", {  
  api_host: '/ingest',  
  ui_host: import.meta.env.VITE_POSTHOG_HOST,  
  person_profiles: 'always',  
  disable_session_recording: false, // явно вмикаємо (або просто не вказуй — буде увімкнено)  
  session_recording: {  
    maskAllInputs: false,  
  },  
});  

window.posthog = posthog;