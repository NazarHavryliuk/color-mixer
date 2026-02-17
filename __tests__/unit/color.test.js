import { describe, it, expect } from 'vitest';
import { rgbToHex, mixColors } from '../../js/color.js';

describe('rgbToHex', () => {
  it('converts pure red', () => expect(rgbToHex(255,0,0)).toBe('#FF0000'));
  it('converts pure green', () => expect(rgbToHex(0,255,0)).toBe('#00FF00'));
  it('converts pure blue', () => expect(rgbToHex(0,0,255)).toBe('#0000FF'));
  it('converts black', () => expect(rgbToHex(0,0,0)).toBe('#000000'));
  it('converts white', () => expect(rgbToHex(255,255,255)).toBe('#FFFFFF'));
  it('pads single digit hex', () => expect(rgbToHex(1,2,3)).toBe('#010203'));
  it('returns uppercase HEX', () => expect(rgbToHex(15,15,15)).toBe('#0F0F0F'));
});

describe('mixColors', () => {
  it('returns correct rgb string', () => expect(mixColors(255,0,0)).toBe('rgb(255, 0, 0)'));
  it('works with random values', () => expect(mixColors(123,45,67)).toBe('rgb(123, 45, 67)'));
  it('works with zero values', () => expect(mixColors(0,0,0)).toBe('rgb(0, 0, 0)'));
  it('handles max values', () => expect(mixColors(255,255,255)).toBe('rgb(255, 255, 255)'));
});

