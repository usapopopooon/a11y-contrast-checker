import { getBackgroundColor } from './getBackgroundColor.mjs';
import { getContrastRatio } from './getContrastRatio.mjs';
import { getSelector } from './getSelector.mjs';

/**
 * リンクのコントラスト違反を検出
 * WCAG 1.4.1: リンクは周囲のテキストと3:1以上の差、または下線で区別
 */
export function detectLinkViolations() {
  const violations = [];
  const REQUIRED_RATIO_VS_BG = 4.5;
  const REQUIRED_RATIO_VS_TEXT = 3.0;

  const links = document.querySelectorAll('a');

  for (const link of links) {
    const style = getComputedStyle(link);
    const linkColor = style.color;
    const bgColor = getBackgroundColor(link);
    const textDecoration = style.textDecorationLine;
    const hasUnderline = textDecoration.includes('underline');

    // 背景とのコントラストをチェック
    const ratioVsBg = getContrastRatio(linkColor, bgColor);

    if (ratioVsBg < REQUIRED_RATIO_VS_BG) {
      const rect = link.getBoundingClientRect();
      violations.push({
        type: 'link',
        selector: getSelector(link),
        text: link.textContent?.slice(0, 50) || '',
        color: linkColor,
        backgroundColor: bgColor,
        ratio: Math.round(ratioVsBg * 100) / 100,
        required: REQUIRED_RATIO_VS_BG,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      });
    }

    // 下線がない場合、周囲テキストとの区別もチェック
    if (!hasUnderline) {
      const parent = link.parentElement;
      if (parent) {
        const parentColor = getComputedStyle(parent).color;
        const ratioVsText = getContrastRatio(linkColor, parentColor);
        if (
          ratioVsText < REQUIRED_RATIO_VS_TEXT &&
          ratioVsBg >= REQUIRED_RATIO_VS_BG
        ) {
          const rect = link.getBoundingClientRect();
          violations.push({
            type: 'link-distinction',
            selector: getSelector(link),
            text: link.textContent?.slice(0, 50) || '',
            color: linkColor,
            backgroundColor: parentColor,
            ratio: Math.round(ratioVsText * 100) / 100,
            required: REQUIRED_RATIO_VS_TEXT,
            note: '下線なしで周囲テキストと区別不足',
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

  return violations;
}
