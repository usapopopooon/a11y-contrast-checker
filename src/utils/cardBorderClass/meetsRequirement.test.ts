import { describe, it, expect } from 'vitest';
import { meetsRequirement } from './meetsRequirement';

describe('meetsRequirement', () => {
  it('比率が基準以上の場合trueを返す', () => {
    expect(meetsRequirement(4.5, 4.5)).toBe(true);
    expect(meetsRequirement(5.0, 4.5)).toBe(true);
    expect(meetsRequirement(21, 3.0)).toBe(true);
  });

  it('比率が基準未満の場合falseを返す', () => {
    expect(meetsRequirement(4.4, 4.5)).toBe(false);
    expect(meetsRequirement(2.9, 3.0)).toBe(false);
    expect(meetsRequirement(0, 4.5)).toBe(false);
  });

  it('境界値を正しく判定する', () => {
    expect(meetsRequirement(4.5, 4.5)).toBe(true);
    expect(meetsRequirement(4.49999, 4.5)).toBe(false);
  });

  it('比率が大幅に超える場合trueを返す', () => {
    expect(meetsRequirement(21, 4.5)).toBe(true);
  });

  it('比率が0の場合falseを返す', () => {
    expect(meetsRequirement(0, 1)).toBe(false);
  });
});
