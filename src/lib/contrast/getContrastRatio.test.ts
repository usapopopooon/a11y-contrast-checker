import { describe, it, expect } from 'vitest';
import { getContrastRatio } from './getContrastRatio';

describe('getContrastRatio', () => {
  it('黒と白のコントラスト比は21:1', () => {
    const ratio = getContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('同じ色のコントラスト比は1:1', () => {
    const ratio = getContrastRatio('rgb(128, 128, 128)', 'rgb(128, 128, 128)');
    expect(ratio).toBeCloseTo(1, 5);
  });

  it('赤と白のコントラスト比を計算する', () => {
    const ratio = getContrastRatio('rgb(255, 0, 0)', 'rgb(255, 255, 255)');
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(21);
  });

  it('順序に関係なく同じ結果を返す', () => {
    const ratio1 = getContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    const ratio2 = getContrastRatio('rgb(255, 255, 255)', 'rgb(0, 0, 0)');
    expect(ratio1).toBeCloseTo(ratio2, 5);
  });

  it('無効な色の場合1を返す', () => {
    const ratio = getContrastRatio('invalid', 'rgb(255, 255, 255)');
    expect(ratio).toBe(1);
  });
});
