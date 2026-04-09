// script.js
import { mixColors, rgbToHex } from "./color.js";
import { client, getDistinctId } from "./posthog.js";
import * as Sentry from "@sentry/browser";

client.onFeatureFlags(() => {
  if (client.isFeatureEnabled('show-urgent-filter')) {
    const btn = document.getElementById('urgent-btn');
    if (btn) btn.style.display = 'inline-block';
  }
});

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

  let mixingStartTime = null;

  function onSliderChange() {
    if (!mixingStartTime) mixingStartTime = Date.now();
    const r = Number(red.value);
    const g = Number(green.value);
    const b = Number(blue.value);
    updateColor(r, g, b, colorBox, hexOutput);
    client.capture("color mixed", {
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

        // Span 1: color computation
        const hex = await Sentry.startSpan(
          { name: "color.compute", op: "compute" },
          async () => {
            // Simulate heavier computation so the span is visible in Waterfall
            await new Promise((res) => setTimeout(res, 40));
            applySensorColor(r, g, b, sensorBox, sensorHex);
            return rgbToHex(r, g, b);
          }
        );

        // Span 2: brightness & dominant channel analysis
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

        // Span 3: analytics capture
        await Sentry.startSpan(
          { name: "posthog.capture", op: "analytics" },
          async () => {
            const timeToComplete = mixingStartTime
              ? Math.round((Date.now() - mixingStartTime) / 1000)
              : 0;
            mixingStartTime = null;
            client.capture("color_completed", { time_to_complete_seconds: timeToComplete });
            client.capture("color_created", {
              hex,
              red: r,
              green: g,
              blue: b,
              brightness,
              tone: brightness > 127 ? "light" : "dark",
              dominant_channel: dominant,
              is_grayscale: r === g && g === b,
            });
            client.capture("sensor color applied", { red: r, green: g, blue: b, hex });
          }
        );

        rootSpan.setAttribute("color.hex", hex);
        rootSpan.setAttribute("color.brightness", brightness);
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
    client.capture("color_reset", {
      reason: "manual_reset",
      previous_hex: prevHex,
    });
  });

  const breakBtn = document.getElementById("break-btn");
  if (breakBtn) {
    breakBtn.addEventListener("click", () => {
      myUndefinedFunction();
      throw new Error("Sentry Test Error: Something went wrong!");
    });
  }

  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginForm = document.getElementById("login-form");
  const userInfo = document.getElementById("user-info");
  const userLabel = document.getElementById("user-label");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      Sentry.startSpan(
        { name: "user.login", op: "ui.action" },
        async () => {
          const id = document.getElementById("login-id").value.trim() || "12345";
          const email = document.getElementById("login-email").value.trim() || "student@example.com";
          const segment = document.getElementById("login-segment").value;

          // Span: simulate auth token validation
          await Sentry.startSpan(
            { name: "auth.validate", op: "http.client" },
            async () => {
              await new Promise((res) => setTimeout(res, 60));
            }
          );

          // Span: set user context
          await Sentry.startSpan(
            { name: "sentry.setUser", op: "sentry" },
            async () => {
              Sentry.setUser({ id, email, segment });
            }
          );

          loginForm.style.display = "none";
          userInfo.style.display = "flex";
          userLabel.textContent = `${email} (${segment})`;
        }
      );
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Sentry.setUser(null);

      userInfo.style.display = "none";
      loginForm.style.display = "block";
    });
  }

  // початкове оновлення
  onSliderChange();
}
