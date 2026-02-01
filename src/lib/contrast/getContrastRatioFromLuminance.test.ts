import { describe, it, expect } from 'vitest';
import { getContrastRatioFromLuminance } from './getContrastRatioFromLuminance';

describe('getContrastRatioFromLuminance', () => {
  it('黒(0)と白(1)のコントラスト比は21:1', () => {
    const ratio = getContrastRatioFromLuminance(0, 1);
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('順序に関係なく同じ結果を返す', () => {
    const ratio1 = getContrastRatioFromLuminance(0, 1);
    const ratio2 = getContrastRatioFromLuminance(1, 0);
    expect(ratio1).toBeCloseTo(ratio2, 5);
  });

  it('同じ輝度のコントラスト比は1:1', () => {
    expect(getContrastRatioFromLuminance(0.5, 0.5)).toBeCloseTo(1, 5);
    expect(getContrastRatioFromLuminance(0, 0)).toBeCloseTo(1, 5);
    expect(getContrastRatioFromLuminance(1, 1)).toBeCloseTo(1, 5);
  });

  it('中間輝度間のコントラスト比を計算する', () => {
    const ratio = getContrastRatioFromLuminance(0.2, 0.8);
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(21);
  });
});
