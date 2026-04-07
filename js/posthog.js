// js/posthog.js
import posthog from "posthog-js";

posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  person_profiles: "identified_only",
});

function getDistinctId() {
  let id = localStorage.getItem("ph_distinct_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ph_distinct_id", id);
  }
  return id;
}

export { posthog as client, getDistinctId };
