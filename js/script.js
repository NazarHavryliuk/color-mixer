// script.js
import { mixColors, rgbToHex } from "./color.js";
import { client, getDistinctId } from "./posthog.js";

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
  const sensorBox = document.getElementById("sensorBox");
  const sensorHex = document.getElementById("sensorHex");

  function onSliderChange() {
    const r = Number(red.value);
    const g = Number(green.value);
    const b = Number(blue.value);
    updateColor(r, g, b, colorBox, hexOutput);
    try {
      client.capture({
        distinctId: getDistinctId(),
        event: "color mixed",
        properties: {
          red: r,
          green: g,
          blue: b,
          hex: rgbToHex(r, g, b),
        },
      });
    } catch (err) {
      client.captureException(err, getDistinctId());
    }
  }

  red.addEventListener("input", onSliderChange);
  green.addEventListener("input", onSliderChange);
  blue.addEventListener("input", onSliderChange);

  button.addEventListener("click", () => {
    const r = Number(red.value);
    const g = Number(green.value);
    const b = Number(blue.value);
    applySensorColor(r, g, b, sensorBox, sensorHex);
    try {
      client.capture({
        distinctId: getDistinctId(),
        event: "sensor color applied",
        properties: {
          red: r,
          green: g,
          blue: b,
          hex: rgbToHex(r, g, b),
        },
      });
    } catch (err) {
      client.captureException(err, getDistinctId());
    }
  });

  // початкове оновлення
  onSliderChange();
}
