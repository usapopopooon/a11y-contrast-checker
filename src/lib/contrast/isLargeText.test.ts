import { describe, it, expect } from 'vitest';
import { isLargeText } from './isLargeText';

describe('isLargeText', () => {
  // WCAG 2.1: 大きいテキストは18pt(24px)以上、または14pt(18.67px)以上で太字
  // 注意: この関数はfontWeightをparseIntするため、"bold"は数値として扱われない

  it('24px以上は大きいテキスト', () => {
    expect(isLargeText('24px', 'normal')).toBe(true);
    expect(isLargeText('24px', '400')).toBe(true);
    expect(isLargeText('30px', 'normal')).toBe(true);
  });

  it('24px未満で通常ウェイトは小さいテキスト', () => {
    expect(isLargeText('23px', 'normal')).toBe(false);
    expect(isLargeText('20px', '400')).toBe(false);
  });

  it('18.67px以上でweight 700以上は大きいテキスト', () => {
    expect(isLargeText('19px', '700')).toBe(true);
    expect(isLargeText('20px', '700')).toBe(true);
    expect(isLargeText('19px', '800')).toBe(true);
  });

  it('18.67px未満でweight 700は小さいテキスト', () => {
    expect(isLargeText('18px', '700')).toBe(false);
    expect(isLargeText('16px', '700')).toBe(false);
  });

  it('14px通常は小さいテキスト', () => {
    expect(isLargeText('14px', 'normal')).toBe(false);
    expect(isLargeText('14px', '400')).toBe(false);
  });

  it('12pxは小さいテキスト', () => {
    expect(isLargeText('12px', 'normal')).toBe(false);
    expect(isLargeText('12px', '700')).toBe(false);
  });

  it('太字判定の閾値は700', () => {
    expect(isLargeText('19px', '600')).toBe(false);
    expect(isLargeText('19px', '700')).toBe(true);
    expect(isLargeText('19px', '800')).toBe(true);
  });
});
