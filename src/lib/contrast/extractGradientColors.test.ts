import { describe, it, expect } from 'vitest';
import { extractGradientColors } from './extractGradientColors';

describe('extractGradientColors', () => {
  it('linear-gradientからrgb色を抽出する', () => {
    const colors = extractGradientColors(
      'linear-gradient(to right, rgb(255, 0, 0), rgb(0, 0, 255))'
    );
    expect(colors).toContain('rgb(255, 0, 0)');
    expect(colors).toContain('rgb(0, 0, 255)');
  });

  it('linear-gradientからrgba色を抽出する', () => {
    const colors = extractGradientColors(
      'linear-gradient(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 1))'
    );
    expect(colors).toContain('rgba(0, 0, 0, 0.5)');
    expect(colors).toContain('rgba(255, 255, 255, 1)');
  });

  it('hex色を抽出する', () => {
    const colors = extractGradientColors(
      'linear-gradient(to bottom, #ff0000, #0000ff)'
    );
    expect(colors).toContain('#ff0000');
    expect(colors).toContain('#0000ff');
  });

  it('名前付き色を抽出する', () => {
    const colors = extractGradientColors('linear-gradient(red, blue, green)');
    expect(colors).toContain('red');
    expect(colors).toContain('blue');
    expect(colors).toContain('green');
  });

  it('oklch色を抽出する', () => {
    const colors = extractGradientColors(
      'linear-gradient(oklch(0.5 0.2 240), oklch(0.8 0.1 120))'
    );
    expect(colors).toContain('oklch(0.5 0.2 240)');
    expect(colors).toContain('oklch(0.8 0.1 120)');
  });

  it('hsl色を抽出する', () => {
    const colors = extractGradientColors(
      'linear-gradient(hsl(0, 100%, 50%), hsl(240, 100%, 50%))'
    );
    expect(colors).toContain('hsl(0, 100%, 50%)');
    expect(colors).toContain('hsl(240, 100%, 50%)');
  });

  it('空のグラデーションは空配列を返す', () => {
    const colors = extractGradientColors('none');
    expect(colors).toEqual([]);
  });
});
