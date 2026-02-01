import { describe, it, expect } from 'vitest';
import { getLuminance } from './getLuminance';

describe('getLuminance', () => {
  it('黒(0,0,0)の輝度は0', () => {
    expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 5);
  });

  it('白(255,255,255)の輝度は1', () => {
    expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 5);
  });

  it('赤(255,0,0)の輝度を計算する', () => {
    const luminance = getLuminance(255, 0, 0);
    expect(luminance).toBeGreaterThan(0);
    expect(luminance).toBeLessThan(1);
    // 赤の相対輝度は約0.2126
    expect(luminance).toBeCloseTo(0.2126, 2);
  });

  it('緑(0,255,0)の輝度を計算する', () => {
    const luminance = getLuminance(0, 255, 0);
    // 緑の相対輝度は約0.7152
    expect(luminance).toBeCloseTo(0.7152, 2);
  });

  it('青(0,0,255)の輝度を計算する', () => {
    const luminance = getLuminance(0, 0, 255);
    // 青の相対輝度は約0.0722
    expect(luminance).toBeCloseTo(0.0722, 2);
  });

  it('グレー(128,128,128)の輝度を計算する', () => {
    const luminance = getLuminance(128, 128, 128);
    expect(luminance).toBeGreaterThan(0);
    expect(luminance).toBeLessThan(1);
  });
});
