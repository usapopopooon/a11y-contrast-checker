import { describe, it, expect } from 'vitest';
import { isValidDetection } from './isValidDetection';

describe('isValidDetection', () => {
  it('1.05より大きい場合trueを返す', () => {
    expect(isValidDetection(1.06)).toBe(true);
    expect(isValidDetection(4.5)).toBe(true);
    expect(isValidDetection(7.0)).toBe(true);
  });

  it('21以下の場合trueを返す', () => {
    expect(isValidDetection(21)).toBe(true);
    expect(isValidDetection(20.99)).toBe(true);
  });

  it('1.05以下の場合falseを返す', () => {
    expect(isValidDetection(1.05)).toBe(false);
    expect(isValidDetection(1.0)).toBe(false);
    expect(isValidDetection(0.5)).toBe(false);
    expect(isValidDetection(0)).toBe(false);
  });

  it('21より大きい場合falseを返す', () => {
    expect(isValidDetection(21.01)).toBe(false);
    expect(isValidDetection(22)).toBe(false);
    expect(isValidDetection(100)).toBe(false);
  });

  it('境界値をテストする', () => {
    expect(isValidDetection(1.050001)).toBe(true);
    expect(isValidDetection(21.000001)).toBe(false);
  });
});
