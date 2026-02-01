import type { DetectionResult, DetectionOptions } from './types';
import { isValidColor } from './isValidColor';
import { getContrastRatio } from './getContrastRatio';
import { getBackgroundColor } from './getBackgroundColor';
import { getGradientInfo } from './getGradientInfo';
import { getWorstGradientBackground } from './getWorstGradientBackground';
import { waitForStyleStable } from './waitForStyleStable';
import { detectFocusRingColorAsync } from './detectFocusRingColorAsync';
import { detectContrast } from './detectContrast';

/**
 * 要素のコントラストを検知（非同期版）
 * DOM/スタイルの安定化を待ってから検知
 */
export const detectContrastAsync = async (
  element: Element,
  options: DetectionOptions = {}
): Promise<DetectionResult> => {
  await waitForStyleStable(element, {
    timeout: 200,
    interval: 30,
    checkCount: 2,
  });

  const gradientInfo = getGradientInfo(element);

  // 背景色取得のヘルパー（グラデーションならワースト色、そうでなければ再帰で探索）
  const getBgColor = (foregroundColor: string): string =>
    gradientInfo.isGradient && gradientInfo.colors.length > 0
      ? getWorstGradientBackground(foregroundColor, gradientInfo.colors)
      : getBackgroundColor(element);

  // プレースホルダー優先モード
  if (
    options.prioritizePlaceholder &&
    (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') &&
    element.hasAttribute('placeholder')
  ) {
    const placeholderStyle = getComputedStyle(element, '::placeholder');
    const placeholderColor = placeholderStyle.color;
    if (isValidColor(placeholderColor)) {
      const bgColor = getBgColor(placeholderColor);
      const ratio = getContrastRatio(placeholderColor, bgColor);
      return {
        detected: true,
        ratio: Math.round(ratio * 100) / 100,
        color: placeholderColor,
        bgColor: bgColor,
        type: 'placeholder',
      };
    }
  }

  // フォーカスリング検知モード（非同期）
  if (options.detectFocusRing) {
    const focusRing = await detectFocusRingColorAsync(element, {
      timeout: options.focusRingDelay ?? 150,
    });
    if (focusRing) {
      const bgColor = getBgColor(focusRing.color);
      const ratio = getContrastRatio(focusRing.color, bgColor);
      return {
        detected: true,
        ratio: Math.round(ratio * 100) / 100,
        color: focusRing.color,
        bgColor: bgColor,
        type: 'focus-ring',
      };
    }
  }

  // 同期版と同じロジック
  return detectContrast(element, { ...options, detectFocusRing: false });
};
