import type { DetectionResult, DetectionOptions } from './types';
import { isValidColor } from './isValidColor';
import { isValidDetection } from './isValidDetection';
import { getContrastRatio } from './getContrastRatio';
import { getBackgroundColor } from './getBackgroundColor';
import { getGradientInfo } from './getGradientInfo';
import { getWorstGradientBackground } from './getWorstGradientBackground';
import { detectFocusRingColor } from './detectFocusRingColor';

/**
 * 要素のコントラストを検知（フォールバック方式）
 */
export const detectContrast = (
  element: Element,
  options: DetectionOptions = {}
): DetectionResult => {
  const style = getComputedStyle(element);
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

  // フォーカスリング検知モード
  if (options.detectFocusRing) {
    const focusRing = detectFocusRingColor(element);
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

  // ボーダー優先モード
  if (options.prioritizeBorder) {
    const borderWidth = parseFloat(style.borderWidth);
    if (borderWidth > 0 && style.borderStyle !== 'none') {
      const borderColor = style.borderColor;
      if (isValidColor(borderColor)) {
        const bgColor =
          gradientInfo.isGradient && gradientInfo.colors.length > 0
            ? getWorstGradientBackground(borderColor, gradientInfo.colors)
            : getBackgroundColor(element);
        const ratio = getContrastRatio(borderColor, bgColor);
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: borderColor,
          bgColor: bgColor,
          type: 'border',
        };
      }
    }
  }

  // SVG優先モード
  if (options.prioritizeSvg) {
    const svg =
      element.tagName === 'svg' ? element : element.querySelector('svg');
    if (svg) {
      const svgStyle = getComputedStyle(svg);
      const fill = svgStyle.fill;
      if (isValidColor(fill)) {
        const bgColor =
          gradientInfo.isGradient && gradientInfo.colors.length > 0
            ? getWorstGradientBackground(fill, gradientInfo.colors)
            : getBackgroundColor(element);
        const ratio = getContrastRatio(fill, bgColor);
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: fill,
          bgColor: bgColor,
          type: 'svg',
        };
      }
      const stroke = svgStyle.stroke;
      if (isValidColor(stroke)) {
        const bgColor =
          gradientInfo.isGradient && gradientInfo.colors.length > 0
            ? getWorstGradientBackground(stroke, gradientInfo.colors)
            : getBackgroundColor(element);
        const ratio = getContrastRatio(stroke, bgColor);
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: stroke,
          bgColor: bgColor,
          type: 'svg',
        };
      }
    }
  }

  // グラデーション背景のテキスト（キャンバスベースのワースト色計算）
  if (gradientInfo.isGradient && gradientInfo.colors.length > 0) {
    const textColor = style.color;
    if (isValidColor(textColor)) {
      const worstBg = getWorstGradientBackground(
        textColor,
        gradientInfo.colors
      );
      const ratio = getContrastRatio(textColor, worstBg);
      if (isValidDetection(ratio)) {
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: textColor,
          bgColor: worstBg,
          type: 'gradient',
        };
      }
    }
  }

  // 通常のテキスト色（単純に背景色を再帰で探して比較）
  const textColor = style.color;
  if (isValidColor(textColor)) {
    const bgColor = getBackgroundColor(element);
    const ratio = getContrastRatio(textColor, bgColor);
    if (isValidDetection(ratio)) {
      // リンク要素の場合は下線の有無もチェック
      if (element.tagName === 'A') {
        const hasUnderline = style.textDecorationLine.includes('underline');
        if (hasUnderline) {
          // 下線ありなら背景とのコントラストを返す
          return {
            detected: true,
            ratio: Math.round(ratio * 100) / 100,
            color: textColor,
            bgColor: bgColor,
            type: 'link',
            hasUnderline: true,
          };
        } else {
          // 下線なしなら親テキストとの区別を見る
          const parent = element.parentElement;
          if (parent) {
            const parentColor = getComputedStyle(parent).color;
            const ratioVsText = getContrastRatio(textColor, parentColor);
            return {
              detected: true,
              ratio: Math.round(ratioVsText * 100) / 100,
              color: textColor,
              bgColor: parentColor,
              type: 'link-no-underline',
              hasUnderline: false,
            };
          }
          // 親がない場合は背景との対比を返す
          return {
            detected: true,
            ratio: Math.round(ratio * 100) / 100,
            color: textColor,
            bgColor: bgColor,
            type: 'link-no-underline',
            hasUnderline: false,
          };
        }
      }
      return {
        detected: true,
        ratio: Math.round(ratio * 100) / 100,
        color: textColor,
        bgColor: bgColor,
        type: 'text',
      };
    }
  }

  // ボーダー色（グラデーション背景対応）
  const borderWidth = parseFloat(style.borderWidth);
  if (borderWidth > 0 && style.borderStyle !== 'none') {
    const borderColor = style.borderColor;
    if (isValidColor(borderColor)) {
      // グラデーション背景ならワースト色、そうでなければ単純に背景色を取得
      const bgColor =
        gradientInfo.isGradient && gradientInfo.colors.length > 0
          ? getWorstGradientBackground(borderColor, gradientInfo.colors)
          : getBackgroundColor(element);
      const ratio = getContrastRatio(borderColor, bgColor);
      if (isValidDetection(ratio)) {
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: borderColor,
          bgColor: bgColor,
          type: 'border',
        };
      }
    }
  }

  // SVG fill/stroke（グラデーション背景対応）
  const svg =
    element.tagName === 'svg' ? element : element.querySelector('svg');
  if (svg) {
    const svgStyle = getComputedStyle(svg);
    const fill = svgStyle.fill;
    if (isValidColor(fill)) {
      const bgColor =
        gradientInfo.isGradient && gradientInfo.colors.length > 0
          ? getWorstGradientBackground(fill, gradientInfo.colors)
          : getBackgroundColor(element);
      const ratio = getContrastRatio(fill, bgColor);
      if (isValidDetection(ratio)) {
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: fill,
          bgColor: bgColor,
          type: 'svg',
        };
      }
    }
    const stroke = svgStyle.stroke;
    if (isValidColor(stroke)) {
      const bgColor =
        gradientInfo.isGradient && gradientInfo.colors.length > 0
          ? getWorstGradientBackground(stroke, gradientInfo.colors)
          : getBackgroundColor(element);
      const ratio = getContrastRatio(stroke, bgColor);
      if (isValidDetection(ratio)) {
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: stroke,
          bgColor: bgColor,
          type: 'svg',
        };
      }
    }
  }

  // プレースホルダー色（フォールバック、グラデーション背景対応）
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const placeholderStyle = getComputedStyle(element, '::placeholder');
    const placeholderColor = placeholderStyle.color;
    if (isValidColor(placeholderColor)) {
      const bgColor =
        gradientInfo.isGradient && gradientInfo.colors.length > 0
          ? getWorstGradientBackground(placeholderColor, gradientInfo.colors)
          : getBackgroundColor(element);
      const ratio = getContrastRatio(placeholderColor, bgColor);
      if (isValidDetection(ratio)) {
        return {
          detected: true,
          ratio: Math.round(ratio * 100) / 100,
          color: placeholderColor,
          bgColor: bgColor,
          type: 'placeholder',
        };
      }
    }
  }

  // フォールバック（単純に背景色を再帰で探して比較）
  const fallbackBg = getBackgroundColor(element);
  const fallbackRatio = getContrastRatio(textColor, fallbackBg);
  return {
    detected: true,
    ratio: Math.round(fallbackRatio * 100) / 100,
    color: textColor,
    bgColor: fallbackBg,
    type: 'unknown',
  };
};
