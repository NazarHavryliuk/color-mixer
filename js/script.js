// script.js
import { mixColors, rgbToHex } from "./color.js";
import { client } from "./posthog.js";
import * as Sentry from "@sentry/browser";

client?.onFeatureFlags?.(() => {
  if (client?.isFeatureEnabled?.("show-urgent-filter")) {
    const btn = document.getElementById("urgent-btn");
    if (btn) btn.style.display = "inline-block";
  }
});

function setLoggedInState(loginForm, userInfo, userLabel, appStatus, userId, email, segment) {
  if (loginForm) loginForm.style.display = "none";
  if (userInfo) userInfo.style.display = "block";
  if (userLabel) {
    const parts = [userId, email].filter(Boolean);
    userLabel.textContent = parts.join(" • ");
  }
  if (appStatus) appStatus.textContent = `Logged in as ${segment || "user"}`;
}

function setLoggedOutState(loginForm, userInfo, userLabel, appStatus) {
  if (loginForm) loginForm.style.display = "block";
  if (userInfo) userInfo.style.display = "none";
  if (userLabel) userLabel.textContent = "";
  if (appStatus) appStatus.textContent = "Logged out";
}

function applyUserContext(userId, email, segment) {
  const normalizedId = String(userId || "").trim();
  const normalizedEmail = String(email || "").trim();
  const normalizedSegment = String(segment || "free_user").trim();

  if (!normalizedId && !normalizedEmail) return;

  if (normalizedId) {
    client?.identify?.(normalizedId, {
      email: normalizedEmail,
      segment: normalizedSegment,
    });
  }

  Sentry.setUser({
    ...(normalizedId ? { id: normalizedId } : {}),
    ...(normalizedEmail ? { email: normalizedEmail } : {}),
  });
  Sentry.setTag("user_segment", normalizedSegment);
  Sentry.setContext("auth", {
    login_id: normalizedId || null,
    email: normalizedEmail || null,
    segment: normalizedSegment,
  });
}

export function updateColor(r, g, b, box, hexOutput) {
  box.style.backgroundColor = mixColors(r, g, b);
  hexOutput.textContent = rgbToHex(r, g, b);
}

export function applySensorColor(r, g, b, box, hexOutput) {
  updateColor(r, g, b, box, hexOutput);
}

export function init() {
  const red = document.getElementById("red");
  const green = document.getElementById("green");
  const blue = document.getElementById("blue");

  const colorBox = document.getElementById("colorBox");
  const hexOutput = document.getElementById("hexColor");

  const button = document.getElementById("applyColor");
  const resetButton = document.getElementById("resetColor");
  const sensorBox = document.getElementById("sensorBox");
  const sensorHex = document.getElementById("sensorHex");

  const loginIdInput = document.getElementById("login-id");
  const loginEmailInput = document.getElementById("login-email");
  const loginSegmentInput = document.getElementById("login-segment");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginForm = document.getElementById("login-form");
  const userInfo = document.getElementById("user-info");
  const userLabel = document.getElementById("user-label");
  const appStatus = document.getElementById("app-status");

  if (!red || !green || !blue || !colorBox || !hexOutput || !button || !resetButton || !sensorBox || !sensorHex) {
    return;
  }

  function syncUserContextFromInputs() {
    applyUserContext(
      loginIdInput?.value,
      loginEmailInput?.value,
      loginSegmentInput?.value
    );
  }

  let mixingStartTime = null;

  function onSliderChange() {
    if (!mixingStartTime) mixingStartTime = Date.now();
    const r = Number(red.value);
    const g = Number(green.value);
    const b = Number(blue.value);
    updateColor(r, g, b, colorBox, hexOutput);
    client?.capture?.("color mixed", {
      red: r,
      green: g,
      blue: b,
      hex: rgbToHex(r, g, b),
    });
  }

  red.addEventListener("input", onSliderChange);
  green.addEventListener("input", onSliderChange);
  blue.addEventListener("input", onSliderChange);

  button.addEventListener("click", () => {
    Sentry.startSpan(
      { name: "Apply Color (Read Sensors)", op: "ui.action" },
      async (rootSpan) => {
        const r = Number(red.value);
        const g = Number(green.value);
        const b = Number(blue.value);

        const hex = await Sentry.startSpan(
          { name: "color.compute", op: "compute" },
          async () => {
            await new Promise((res) => setTimeout(res, 40));
            applySensorColor(r, g, b, sensorBox, sensorHex);
            return rgbToHex(r, g, b);
          }
        );

        const { brightness, dominant } = await Sentry.startSpan(
          { name: "color.analyze", op: "compute" },
          async () => {
            await new Promise((res) => setTimeout(res, 20));
            return {
              brightness: Math.round((r * 299 + g * 587 + b * 114) / 1000),
              dominant: r >= g && r >= b ? "red" : g >= b ? "green" : "blue",
            };
          }
        );

        await Sentry.startSpan(
          { name: "posthog.capture", op: "analytics" },
          async () => {
            const timeToComplete = mixingStartTime
              ? Math.round((Date.now() - mixingStartTime) / 1000)
              : 0;
            mixingStartTime = null;

            client?.capture?.("color_completed", { time_to_complete_seconds: timeToComplete });
            client?.capture?.("color_created", {
              hex,
              red: r,
              green: g,
              blue: b,
              brightness,
              tone: brightness > 127 ? "light" : "dark",
              dominant_channel: dominant,
              is_grayscale: r === g && g === b,
            });
            client?.capture?.("sensor color applied", { red: r, green: g, blue: b, hex });
          }
        );

        rootSpan?.setAttribute?.("color.hex", hex);
        rootSpan?.setAttribute?.("color.brightness", brightness);
      }
    );
  });

  resetButton.addEventListener("click", () => {
    const prevHex = hexOutput.textContent;
    red.value = 0;
    green.value = 0;
    blue.value = 0;
    mixingStartTime = null;
    updateColor(0, 0, 0, colorBox, hexOutput);

    client?.capture?.("color_reset", {
      reason: "manual_reset",
      previous_hex: prevHex,
    });
  });

  const breakBtn = document.getElementById("break-btn");
  if (breakBtn) {
    breakBtn.addEventListener("click", () => {
      syncUserContextFromInputs();
      throw new Error("Sentry Test Error: Something went wrong!");
    });
  }

  if (loginIdInput && loginEmailInput && loginSegmentInput) {
    loginIdInput.addEventListener("input", syncUserContextFromInputs);
    loginEmailInput.addEventListener("input", syncUserContextFromInputs);
    loginSegmentInput.addEventListener("change", syncUserContextFromInputs);
    syncUserContextFromInputs();
  }

  if (loginBtn && loginIdInput && loginEmailInput && loginSegmentInput) {
    loginBtn.addEventListener("click", () => {
      const userId = loginIdInput.value;
      const email = loginEmailInput.value;
      const segment = loginSegmentInput.value;

      applyUserContext(userId, email, segment);
      client?.capture?.("user_login", {
        user_id: userId,
        email_domain: String(email).includes("@") ? String(email).split("@")[1] : "unknown",
        segment,
      });
      setLoggedInState(loginForm, userInfo, userLabel, appStatus, userId, email, segment);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Sentry.setUser(null);
      Sentry.setTag("user_segment", "logged_out");
      Sentry.setContext("auth", null);
      client?.capture?.("user_logout", { reason: "manual_logout" });
      setLoggedOutState(loginForm, userInfo, userLabel, appStatus);
    });
  }

  onSliderChange();
}