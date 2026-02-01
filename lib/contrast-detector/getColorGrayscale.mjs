import { parseColorToRgb } from './parseColorToRgb.mjs';
import { getGrayscaleValue } from './getGrayscaleValue.mjs';

/**
 * CSS色文字列からグレースケール値を取得
 */
export function getColorGrayscale(color) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return 0;
  return getGrayscaleValue(rgb.r, rgb.g, rgb.b);
}
