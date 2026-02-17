import { describe, it, expect, beforeEach } from 'vitest';
import { updateColor } from '../../js/script.js';

describe('Critical path: successful color mix', () => {
  let red, green, blue, colorBox, hexOutput;

  beforeEach(() => {
    red = { value: '255' };
    green = { value: '0' };
    blue = { value: '0' };
    colorBox = { style: { backgroundColor: '' } };
    hexOutput = { textContent: '' };
  });

  it('updates UI correctly after user input', () => {
    updateColor(255, 0, 0, colorBox, hexOutput);
    expect(colorBox.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(hexOutput.textContent).toBe('#FF0000');
  });
});
