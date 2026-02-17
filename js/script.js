//script.js
import { mixColors, rgbToHex } from './color.js';

const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');
const colorBox = document.getElementById('colorBox');
const hexOutput = document.getElementById('hexColor');

function updateColor() {
  const r = Number(red.value);
  const g = Number(green.value);
  const b = Number(blue.value);

  // змінюємо фон
  colorBox.style.backgroundColor = mixColors(r, g, b);

  // показуємо колір у HEX
  hexOutput.textContent = rgbToHex(r, g, b);
}

// слухаємо повзунки
red.addEventListener('input', updateColor);
green.addEventListener('input', updateColor);
blue.addEventListener('input', updateColor);

// початкове оновлення
updateColor();
