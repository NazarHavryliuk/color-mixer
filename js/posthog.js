// js/posthog.js
import posthog from "posthog-js";

function getDistinctId() {
  let id = localStorage.getItem("ph_distinct_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ph_distinct_id", id);
  }
  return id;
}

export { posthog as client, getDistinctId };

