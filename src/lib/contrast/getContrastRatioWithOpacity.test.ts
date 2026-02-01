import { describe, it, expect } from 'vitest';
import { getContrastRatioWithOpacity } from './getContrastRatioWithOpacity';

describe('getContrastRatioWithOpacity', () => {
  it('opacity 1.0では通常のコントラスト比', () => {
    const ratio = getContrastRatioWithOpacity(
      'rgb(0, 0, 0)',
      'rgb(255, 255, 255)',
      1.0
    );
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('opacity 0.5で半透明のコントラスト比', () => {
    const ratio = getContrastRatioWithOpacity(
      'rgb(0, 0, 0)',
      'rgb(255, 255, 255)',
      0.5
    );
    expect(ratio).toBeLessThan(21);
    expect(ratio).toBeGreaterThan(1);
  });

  it('opacity 0ではコントラスト比は1', () => {
    const ratio = getContrastRatioWithOpacity(
      'rgb(0, 0, 0)',
      'rgb(255, 255, 255)',
      0
    );
    expect(ratio).toBeCloseTo(1, 5);
  });

  it('同じ色でopacity 1.0ではコントラスト比は1', () => {
    const ratio = getContrastRatioWithOpacity(
      'rgb(128, 128, 128)',
      'rgb(128, 128, 128)',
      1.0
    );
    expect(ratio).toBeCloseTo(1, 5);
  });

  it('無効な色で1を返す', () => {
    const ratio = getContrastRatioWithOpacity(
      'invalid',
      'rgb(255, 255, 255)',
      1.0
    );
    expect(ratio).toBe(1);
  });
});
