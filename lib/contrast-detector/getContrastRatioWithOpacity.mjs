import { parseColorToRgba } from './parseColorToRgba.mjs';
import { blendColors } from './blendColors.mjs';
import { getLuminance } from './getLuminance.mjs';
import { getContrastRatioFromLuminance } from './getContrastRatioFromLuminance.mjs';

/**
 * opacity考慮版のコントラスト比計算
 * 要素のopacityプロパティも考慮して実際の見た目のコントラストを計算
 */
export function getContrastRatioWithOpacity(color1, color2, opacity) {
  const rgba1 = parseColorToRgba(color1);
  const rgba2 = parseColorToRgba(color2);
  if (!rgba1 || !rgba2) return 1;

  // opacityを色のアルファに適用
  const effectiveAlpha = (rgba1.a || 1) * opacity;
  const blendedColor = blendColors({ ...rgba1, a: effectiveAlpha }, rgba2);

  const l1 = getLuminance(blendedColor.r, blendedColor.g, blendedColor.b);
  const l2 = getLuminance(rgba2.r, rgba2.g, rgba2.b);
  return getContrastRatioFromLuminance(l1, l2);
}
