import { isLargeText } from './isLargeText.mjs';

/**
 * WCAG AA基準判定
 */
export function checkWcagAA(ratio, fontSize, fontWeight) {
  const large = isLargeText(fontSize, fontWeight);
  const required = large ? 3.0 : 4.5;
  return {
    ratio,
    isLargeText: large,
    meetsAA: ratio >= required,
    required,
  };
}
