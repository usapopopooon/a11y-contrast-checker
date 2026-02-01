import { getBackgroundColor } from './getBackgroundColor.mjs';
import { getContrastRatio } from './getContrastRatio.mjs';
import { getSelector } from './getSelector.mjs';

/**
 * UIコンポーネント（ボタン・フォーム）の境界線コントラスト違反を検出
 * WCAG 1.4.11 非テキストコントラスト: 3:1以上
 */
export function detectUIComponentViolations() {
  const violations = [];
  const REQUIRED_RATIO = 3.0;

  // フォーム要素とボタンを取得
  const elements = document.querySelectorAll(
    'input, button, select, textarea, [role="button"], [role="checkbox"], [role="radio"]'
  );

  for (const element of elements) {
    const style = getComputedStyle(element);
    const bgColor = getBackgroundColor(element);

    // border-colorをチェック（境界線が見える場合）
    const borderWidth = parseFloat(style.borderWidth);
    if (borderWidth > 0 && style.borderStyle !== 'none') {
      const borderColor = style.borderColor;
      const ratio = getContrastRatio(borderColor, bgColor);

      if (ratio < REQUIRED_RATIO) {
        const rect = element.getBoundingClientRect();
        violations.push({
          type: 'ui-border',
          selector: getSelector(element),
          text: element.tagName.toLowerCase(),
          color: borderColor,
          backgroundColor: bgColor,
          ratio: Math.round(ratio * 100) / 100,
          required: REQUIRED_RATIO,
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
        });
      }
    }
  }

  return violations;
}
