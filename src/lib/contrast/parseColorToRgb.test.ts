import { describe, it, expect } from 'vitest';
import { parseColorToRgb } from './parseColorToRgb';

describe('parseColorToRgb', () => {
  it('rgb文字列をパースする', () => {
    const result = parseColorToRgb('rgb(255, 128, 64)');
    expect(result).toEqual({ r: 255, g: 128, b: 64 });
  });

  it('rgb文字列(スペースなし)をパースする', () => {
    const result = parseColorToRgb('rgb(100,200,50)');
    expect(result).toEqual({ r: 100, g: 200, b: 50 });
  });

  it('rgba文字列をパースしてアルファを無視する', () => {
    const result = parseColorToRgb('rgba(255, 128, 64, 0.5)');
    expect(result).toEqual({ r: 255, g: 128, b: 64 });
  });

  it('無効な色でnullを返す', () => {
    expect(parseColorToRgb('invalid')).toBeNull();
  });

  it('黒をパースする', () => {
    const result = parseColorToRgb('rgb(0, 0, 0)');
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('白をパースする', () => {
    const result = parseColorToRgb('rgb(255, 255, 255)');
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });
});
