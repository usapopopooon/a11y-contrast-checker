import { describe, it, expect } from 'vitest';
import { getExpectedType } from './getExpectedType';

describe('getExpectedType', () => {
  it('detectFocusRingがtrueの場合、focus-ringを返す', () => {
    expect(getExpectedType({ detectFocusRing: true })).toBe('focus-ring');
  });

  it('prioritizePlaceholderがtrueの場合、placeholderを返す', () => {
    expect(getExpectedType({ prioritizePlaceholder: true })).toBe(
      'placeholder'
    );
  });

  it('prioritizeBorderがtrueの場合、borderを返す', () => {
    expect(getExpectedType({ prioritizeBorder: true })).toBe('border');
  });

  it('prioritizeSvgがtrueの場合、svgを返す', () => {
    expect(getExpectedType({ prioritizeSvg: true })).toBe('svg');
  });

  it('優先モードがない場合、nullを返す', () => {
    expect(getExpectedType({})).toBeNull();
  });

  it('複数の優先モードがある場合、最初にマッチしたものを返す', () => {
    expect(
      getExpectedType({
        detectFocusRing: true,
        prioritizePlaceholder: true,
      })
    ).toBe('focus-ring');
  });

  it('全てfalseの場合、nullを返す', () => {
    expect(
      getExpectedType({
        detectFocusRing: false,
        prioritizePlaceholder: false,
        prioritizeBorder: false,
        prioritizeSvg: false,
      })
    ).toBeNull();
  });
});
