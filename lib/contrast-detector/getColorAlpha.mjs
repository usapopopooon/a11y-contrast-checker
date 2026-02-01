import { parseColorToRgba } from './parseColorToRgba.mjs';

/**
 * CSS色文字列からアルファ値を抽出
 */
export function getColorAlpha(color) {
  const rgba = parseColorToRgba(color);
  return rgba ? rgba.a : 1;
}
