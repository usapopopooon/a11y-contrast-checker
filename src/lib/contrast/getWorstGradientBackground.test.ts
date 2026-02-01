import { describe, it, expect } from 'vitest';
import { getWorstGradientBackground } from './getWorstGradientBackground';

describe('getWorstGradientBackground', () => {
  it('空の配列でデフォルト白を返す', () => {
    const result = getWorstGradientBackground('rgb(0, 0, 0)', []);
    expect(result).toBe('rgb(255, 255, 255)');
  });

  it('1色のみの場合その色を返す', () => {
    const result = getWorstGradientBackground('rgb(0, 0, 0)', [
      'rgb(200, 200, 200)',
    ]);
    expect(result).toBe('rgb(200, 200, 200)');
  });

  it('複数色の場合、いずれかの色を返す', () => {
    const colors = ['rgb(255, 255, 255)', 'rgb(100, 100, 100)'];
    const result = getWorstGradientBackground('rgb(0, 0, 0)', colors);
    // canvasがjsdomで完全にサポートされていないため、
    // 返される色がcolors配列に含まれることのみ検証
    expect(colors).toContain(result);
  });

  it('明るい色の配列からいずれかを返す', () => {
    const colors = ['rgb(50, 50, 50)', 'rgb(200, 200, 200)'];
    const result = getWorstGradientBackground('rgb(255, 255, 255)', colors);
    expect(colors).toContain(result);
  });
});
