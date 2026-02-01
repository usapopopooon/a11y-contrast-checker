import { getBackgroundColor } from './getBackgroundColor.mjs';
import { getContrastRatio } from './getContrastRatio.mjs';
import { getSelector } from './getSelector.mjs';

/**
 * SVGアイコンのコントラスト違反を検出
 * WCAG 1.4.11 非テキストコントラスト: 3:1以上
 */
export function detectIconViolations() {
  const violations = [];
  const REQUIRED_RATIO = 3.0;

  // SVG要素を取得
  const svgs = document.querySelectorAll('svg');

  for (const svg of svgs) {
    const style = getComputedStyle(svg);
    const bgColor = getBackgroundColor(svg);

    // fill または stroke をチェック
    const fill = style.fill;
    const stroke = style.stroke;

    // fillが有効な色の場合
    if (fill && fill !== 'none' && fill !== 'transparent') {
      const ratio = getContrastRatio(fill, bgColor);
      if (ratio < REQUIRED_RATIO) {
        const rect = svg.getBoundingClientRect();
        // 小さすぎるSVGは装飾的とみなしてスキップ
        if (rect.width >= 16 && rect.height >= 16) {
          violations.push({
            type: 'icon-fill',
            selector: getSelector(svg),
            text: 'SVG icon',
            color: fill,
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

    // strokeが有効な色の場合
    if (stroke && stroke !== 'none' && stroke !== 'transparent') {
      const ratio = getContrastRatio(stroke, bgColor);
      if (ratio < REQUIRED_RATIO) {
        const rect = svg.getBoundingClientRect();
        if (rect.width >= 16 && rect.height >= 16) {
          violations.push({
            type: 'icon-stroke',
            selector: getSelector(svg),
            text: 'SVG icon',
            color: stroke,
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

  return violations;
}
