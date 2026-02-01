/**
 * WCAG 2.1 コントラスト比検出ライブラリ
 * ESMモジュール版（Vite/React用）
 */

// 基本色関数
export { getLuminance } from './getLuminance.mjs';
export { getContrastRatioFromLuminance } from './getContrastRatioFromLuminance.mjs';
export { parseColorToRgba } from './parseColorToRgba.mjs';
export { parseColorToRgb } from './parseColorToRgb.mjs';
export { blendColors } from './blendColors.mjs';
export { getEffectiveOpacity } from './getEffectiveOpacity.mjs';
export { getColorAlpha } from './getColorAlpha.mjs';

// グラデーション関数
export { extractGradientColors } from './extractGradientColors.mjs';
export { getGradientInfo } from './getGradientInfo.mjs';
export { getGrayscaleValue } from './getGrayscaleValue.mjs';
export { getColorGrayscale } from './getColorGrayscale.mjs';
export { getWorstGradientBackground } from './getWorstGradientBackground.mjs';
export { getBackgroundColor } from './getBackgroundColor.mjs';

// コントラスト比関数
export { getContrastRatio } from './getContrastRatio.mjs';
export { getContrastRatioWithOpacity } from './getContrastRatioWithOpacity.mjs';

// WCAG判定関数
export { isLargeText } from './isLargeText.mjs';
export { checkWcagAA } from './checkWcagAA.mjs';
export { getSelector } from './getSelector.mjs';

// 違反検出関数
export { detectTextViolations } from './detectTextViolations.mjs';
export { detectUIComponentViolations } from './detectUIComponentViolations.mjs';
export { detectIconViolations } from './detectIconViolations.mjs';
export { detectPlaceholderViolations } from './detectPlaceholderViolations.mjs';
export { detectLinkViolations } from './detectLinkViolations.mjs';
export { detectPseudoElementViolations } from './detectPseudoElementViolations.mjs';
export { detectFilterWarnings } from './detectFilterWarnings.mjs';
export { detectBlendModeWarnings } from './detectBlendModeWarnings.mjs';
export { detectViolations } from './detectViolations.mjs';
