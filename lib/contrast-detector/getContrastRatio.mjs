import { parseColorToRgba } from './parseColorToRgba.mjs';
import { blendColors } from './blendColors.mjs';
import { getLuminance } from './getLuminance.mjs';
import { getContrastRatioFromLuminance } from './getContrastRatioFromLuminance.mjs';

/**
 * 2つのCSS色文字列からコントラスト比を計算
 * 半透明色の場合はアルファブレンディングを適用
 */
export function getContrastRatio(color1, color2) {
  const rgba1 = parseColorToRgba(color1);
  const rgba2 = parseColorToRgba(color2);
  if (!rgba1 || !rgba2) return 1;

  // 前景色（color1）が半透明の場合、背景色とブレンド
  let effectiveColor1;
  if (rgba1.a < 1) {
    effectiveColor1 = blendColors(rgba1, rgba2);
  } else {
    effectiveColor1 = rgba1;
  }

  const l1 = getLuminance(
    effectiveColor1.r,
    effectiveColor1.g,
    effectiveColor1.b
  );
  const l2 = getLuminance(rgba2.r, rgba2.g, rgba2.b);
  return getContrastRatioFromLuminance(l1, l2);
}
