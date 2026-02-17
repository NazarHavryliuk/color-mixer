//colr.test.js
import { describe, it, expect } from 'vitest';
import { rgbToHex, mixColors } from '../js/color.js';

describe('rgbToHex', () => {
    it('should convert RGB(255, 0, 0) to #FF0000', () => {
        expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
    });

    it('should convert RGB(0, 255, 0) to #00FF00', () => {
        expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
    });

    it('should convert RGB(0, 0, 255) to #0000FF', () => {
        expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
    });
});

it('mixColors works', () => {
  expect(mixColors(255, 0, 0)).toBe('rgb(255, 0, 0)');
});

