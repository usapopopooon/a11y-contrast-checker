import { describe, it, expect } from 'vitest';
import { parseColorToRgba } from './parseColorToRgba';

describe('parseColorToRgba', () => {
  it('rgba文字列をパースする', () => {
    const result = parseColorToRgba('rgba(255, 128, 64, 0.5)');
    expect(result).toEqual({ r: 255, g: 128, b: 64, a: 0.5 });
  });

  it('rgb文字列をパースする（alpha=1）', () => {
    const result = parseColorToRgba('rgb(255, 128, 64)');
    expect(result).toEqual({ r: 255, g: 128, b: 64, a: 1 });
  });

  it('透明なrgbaをパースする', () => {
    const result = parseColorToRgba('rgba(0, 0, 0, 0)');
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });

  it('パーセントアルファをパースする', () => {
    const result = parseColorToRgba('rgba(255, 0, 0, 50%)');
    expect(result).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  it('アルファ1の完全不透明をパースする', () => {
    const result = parseColorToRgba('rgba(100, 150, 200, 1)');
    expect(result).toEqual({ r: 100, g: 150, b: 200, a: 1 });
  });
});
