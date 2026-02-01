import { describe, it, expect } from 'vitest';
import { hasPriorityMode } from './hasPriorityMode';

describe('hasPriorityMode', () => {
  it('detectFocusRingがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ detectFocusRing: true })).toBe(true);
  });

  it('prioritizePlaceholderがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ prioritizePlaceholder: true })).toBe(true);
  });

  it('prioritizeBorderがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ prioritizeBorder: true })).toBe(true);
  });

  it('prioritizeSvgがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ prioritizeSvg: true })).toBe(true);
  });

  it('優先モードがない場合、falseを返す', () => {
    expect(hasPriorityMode({})).toBe(false);
  });

  it('全てfalseの場合、falseを返す', () => {
    expect(
      hasPriorityMode({
        detectFocusRing: false,
        prioritizePlaceholder: false,
        prioritizeBorder: false,
        prioritizeSvg: false,
      })
    ).toBe(false);
  });

  it('複数のモードがtrueの場合、trueを返す', () => {
    expect(
      hasPriorityMode({
        detectFocusRing: true,
        prioritizeBorder: true,
      })
    ).toBe(true);
  });
});
