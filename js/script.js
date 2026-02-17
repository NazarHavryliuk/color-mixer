// script.js
import { mixColors, rgbToHex } from './color.js';


export function updateColor(r, g, b, box, hexOutput) {
  box.style.backgroundColor = mixColors(r, g, b);
  hexOutput.textContent = rgbToHex(r, g, b);
}

export function applySensorColor(r, g, b, box, hexOutput) {
  updateColor(r, g, b, box, hexOutput);
}

export function init() {
  const red = document.getElementById('red');
  const green = document.getElementById('green');
  const blue = document.getElementById('blue');

  const colorBox = document.getElementById('colorBox');
  const hexOutput = document.getElementById('hexColor');

  const button = document.getElementById('applyColor');
  const sensorBox = document.getElementById('sensorBox');
  const sensorHex = document.getElementById('sensorHex');

  function onSliderChange() {
    updateColor(
      Number(red.value),
      Number(green.value),
      Number(blue.value),
      colorBox,
      hexOutput
    );
  }

  red.addEventListener('input', onSliderChange);
  green.addEventListener('input', onSliderChange);
  blue.addEventListener('input', onSliderChange);

  button.addEventListener('click', () => {
    applySensorColor(
      Number(red.value),
      Number(green.value),
      Number(blue.value),
      sensorBox,
      sensorHex
    );
  });

  // початкове оновлення
  onSliderChange();
}
