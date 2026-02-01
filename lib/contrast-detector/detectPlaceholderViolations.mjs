import { getBackgroundColor } from './getBackgroundColor.mjs';
import { getContrastRatio } from './getContrastRatio.mjs';
import { getSelector } from './getSelector.mjs';

/**
 * プレースホルダーのコントラスト違反を検出
 * WCAG 1.4.3: 4.5:1以上
 */
export function detectPlaceholderViolations() {
  const violations = [];
  const REQUIRED_RATIO = 4.5;

  const inputs = document.querySelectorAll(
    'input[placeholder], textarea[placeholder]'
  );

  for (const input of inputs) {
    const placeholder = input.getAttribute('placeholder');
    if (!placeholder) continue;

    // プレースホルダーの色を取得（::placeholder疑似要素）
    const style = getComputedStyle(input, '::placeholder');
    const placeholderColor = style.color;
    const bgColor = getBackgroundColor(input);
    const ratio = getContrastRatio(placeholderColor, bgColor);

    if (ratio < REQUIRED_RATIO) {
      const rect = input.getBoundingClientRect();
      violations.push({
        type: 'placeholder',
        selector: getSelector(input),
        text: placeholder.slice(0, 50),
        color: placeholderColor,
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

  return violations;
}
