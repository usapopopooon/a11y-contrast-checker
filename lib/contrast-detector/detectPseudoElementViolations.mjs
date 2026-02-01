import { getBackgroundColor } from './getBackgroundColor.mjs';
import { getEffectiveOpacity } from './getEffectiveOpacity.mjs';
import { getContrastRatio } from './getContrastRatio.mjs';
import { getContrastRatioWithOpacity } from './getContrastRatioWithOpacity.mjs';
import { getSelector } from './getSelector.mjs';

/**
 * ::before / ::after 疑似要素のコントラスト違反を検出
 * content プロパティにテキストがある場合のみチェック
 */
export function detectPseudoElementViolations() {
  const violations = [];
  const REQUIRED_RATIO = 4.5;

  // 全ての要素をチェック
  const elements = document.querySelectorAll('*');

  for (const element of elements) {
    for (const pseudo of ['::before', '::after']) {
      const style = getComputedStyle(element, pseudo);
      const content = style.content;

      // contentがテキストを含む場合のみチェック（引用符で囲まれた文字列）
      if (
        content &&
        content !== 'none' &&
        content !== 'normal' &&
        content !== '""' &&
        content !== "''"
      ) {
        // 引用符を除去してテキストを取得
        const textMatch = content.match(/^["'](.+)["']$/);
        if (textMatch && textMatch[1].trim()) {
          const color = style.color;
          const bgColor = getBackgroundColor(element);
          const opacity = getEffectiveOpacity(element);
          const ratio =
            opacity < 1
              ? getContrastRatioWithOpacity(color, bgColor, opacity)
              : getContrastRatio(color, bgColor);

          if (ratio < REQUIRED_RATIO) {
            const rect = element.getBoundingClientRect();
            violations.push({
              type: `pseudo-${pseudo.replace('::', '')}`,
              selector: getSelector(element) + pseudo,
              text: textMatch[1].slice(0, 50),
              color,
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
    }
  }

  return violations;
}
