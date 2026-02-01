import { describe, it, expect } from 'vitest';
import { blendColors } from './blendColors';

describe('blendColors', () => {
  it('半透明の黒を白背景にブレンドするとグレーになる', () => {
    const fg = { r: 0, g: 0, b: 0, a: 0.5 };
    const bg = { r: 255, g: 255, b: 255 };
    const result = blendColors(fg, bg);
    expect(result.r).toBeCloseTo(128, 0);
    expect(result.g).toBeCloseTo(128, 0);
    expect(result.b).toBeCloseTo(128, 0);
  });

  it('不透明色はそのまま返す', () => {
    const fg = { r: 100, g: 150, b: 200 };
    const bg = { r: 255, g: 255, b: 255 };
    const result = blendColors(fg, bg);
    expect(result).toEqual({ r: 100, g: 150, b: 200 });
  });

  it('アルファ1の色はそのまま返す', () => {
    const fg = { r: 100, g: 150, b: 200, a: 1 };
    const bg = { r: 0, g: 0, b: 0 };
    const result = blendColors(fg, bg);
    expect(result).toEqual({ r: 100, g: 150, b: 200 });
  });

  it('アルファ0の色は背景色を返す', () => {
    const fg = { r: 255, g: 0, b: 0, a: 0 };
    const bg = { r: 0, g: 255, b: 0 };
    const result = blendColors(fg, bg);
    expect(result).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('25%透明の赤を白背景にブレンドする', () => {
    const fg = { r: 255, g: 0, b: 0, a: 0.25 };
    const bg = { r: 255, g: 255, b: 255 };
    const result = blendColors(fg, bg);
    expect(result.r).toBeCloseTo(255, 0);
    expect(result.g).toBeCloseTo(191, 0);
    expect(result.b).toBeCloseTo(191, 0);
  });
});
