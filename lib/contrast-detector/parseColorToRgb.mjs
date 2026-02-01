import { parseColorToRgba } from './parseColorToRgba.mjs';

/**
 * 後方互換性のためのラッパー関数（アルファなし版）
 */
export function parseColorToRgb(color) {
  const rgba = parseColorToRgba(color);
  if (!rgba) return null;
  return { r: rgba.r, g: rgba.g, b: rgba.b };
}
