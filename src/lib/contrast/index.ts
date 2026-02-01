/**
 * WCAG 2.1 コントラスト比計算ロジック
 * 1関数1ファイル構成のバレルエクスポート
 */

// ============================================================
// 型定義
// ============================================================

export type {
  WcagResult,
  Violation,
  DetectionResult,
  DetectionOptions,
  GradientInfo,
} from './types';

// ============================================================
// 外部ライブラリ再エクスポート（17関数）
// ============================================================

export { getLuminance } from './getLuminance';
export { getContrastRatioFromLuminance } from './getContrastRatioFromLuminance';
export { getContrastRatio } from './getContrastRatio';
export { getContrastRatioWithOpacity } from './getContrastRatioWithOpacity';
export { getBackgroundColor } from './getBackgroundColor';
export { getGradientInfo } from './getGradientInfo';
export { getWorstGradientBackground } from './getWorstGradientBackground';
export { extractGradientColors } from './extractGradientColors';
export { parseColorToRgb } from './parseColorToRgb';
export { parseColorToRgba } from './parseColorToRgba';
export { blendColors } from './blendColors';
export { getEffectiveOpacity } from './getEffectiveOpacity';
export { getColorAlpha } from './getColorAlpha';
export { isLargeText } from './isLargeText';
export { checkWcagAA } from './checkWcagAA';
export { getSelector } from './getSelector';
export { detectViolations } from './detectViolations';

// ============================================================
// 内部ヘルパー関数（5関数）
// ============================================================

export { isValidColor } from './isValidColor';
export { extractBoxShadowColor } from './extractBoxShadowColor';
export { getTailwindRingColor } from './getTailwindRingColor';
export { extractRingShadowFromBoxShadow } from './extractRingShadowFromBoxShadow';
export { isValidDetection } from './isValidDetection';

// ============================================================
// 公開関数（5関数）
// ============================================================

export { waitForStyleStable } from './waitForStyleStable';
export { detectFocusRingColor } from './detectFocusRingColor';
export { detectFocusRingColorAsync } from './detectFocusRingColorAsync';
export { detectContrast } from './detectContrast';
export { detectContrastAsync } from './detectContrastAsync';

// ============================================================
// テスト用エクスポート（後方互換性）
// ============================================================

import { isValidColor } from './isValidColor';
import { extractBoxShadowColor } from './extractBoxShadowColor';
import { getTailwindRingColor } from './getTailwindRingColor';
import { extractRingShadowFromBoxShadow } from './extractRingShadowFromBoxShadow';
import { isValidDetection } from './isValidDetection';

export const _internal = {
  isValidColor,
  extractBoxShadowColor,
  getTailwindRingColor,
  extractRingShadowFromBoxShadow,
  isValidDetection,
} as const;
