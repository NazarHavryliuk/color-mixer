import posthog from 'posthog-js';

posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {  
  api_host: '/ingest',  
  ui_host: import.meta.env.VITE_POSTHOG_HOST,  
  person_profiles: 'always',  
  disable_session_recording: false, // явно вмикаємо (або просто не вказуй — буде увімкнено)  
  session_recording: {  
    maskAllInputs: false,  
  },  
});  

window.posthog = posthog;