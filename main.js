import posthog from 'posthog-js';

posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only', // або 'always' для анонімних користув
});