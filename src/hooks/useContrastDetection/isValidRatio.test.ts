import { describe, it, expect } from 'vitest';
import { isValidRatio } from './isValidRatio';

describe('isValidRatio', () => {
  it('1.05より大きい場合、trueを返す', () => {
    expect(isValidRatio(1.06)).toBe(true);
    expect(isValidRatio(4.5)).toBe(true);
    expect(isValidRatio(21)).toBe(true);
  });

  it('1.05以下の場合、falseを返す', () => {
    expect(isValidRatio(1.05)).toBe(false);
    expect(isValidRatio(1.0)).toBe(false);
    expect(isValidRatio(0)).toBe(false);
  });

  it('境界値1.051でtrueを返す', () => {
    expect(isValidRatio(1.051)).toBe(true);
  });

  it('負の値でfalseを返す', () => {
    expect(isValidRatio(-1)).toBe(false);
  });

  it('非常に大きい値でtrueを返す', () => {
    expect(isValidRatio(100)).toBe(true);
  });
});
