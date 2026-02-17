// js/color.js
export function rgbToHex(r, g, b) {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function mixColors(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}


