import { getGradientInfo } from './getGradientInfo.mjs';
import { getWorstGradientBackground } from './getWorstGradientBackground.mjs';
import { getBackgroundColor } from './getBackgroundColor.mjs';
import { getEffectiveOpacity } from './getEffectiveOpacity.mjs';
import { getContrastRatio } from './getContrastRatio.mjs';
import { getContrastRatioWithOpacity } from './getContrastRatioWithOpacity.mjs';
import { checkWcagAA } from './checkWcagAA.mjs';
import { getSelector } from './getSelector.mjs';

/**
 * テキストのコントラスト違反を検出
 * 半透明色およびopacityプロパティを考慮
 */
export function detectTextViolations() {
  const violations = [];

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const text = node.textContent?.trim();
        return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const checkedElements = new Set();

  for (const textNode of textNodes) {
    const element = textNode.parentElement;
    if (!element || checkedElements.has(element)) continue;
    checkedElements.add(element);

    const style = getComputedStyle(element);
    const color = style.color;

    // グラデーション背景の場合はワーストケースを使用
    const gradientInfo = getGradientInfo(element);
    let bgColor;
    if (gradientInfo.isGradient && gradientInfo.colors.length > 0) {
      bgColor = getWorstGradientBackground(color, gradientInfo.colors);
    } else {
      bgColor = getBackgroundColor(element);
    }

    // opacity考慮のコントラスト比計算
    const opacity = getEffectiveOpacity(element);
    const ratio =
      opacity < 1
        ? getContrastRatioWithOpacity(color, bgColor, opacity)
        : getContrastRatio(color, bgColor);
    const result = checkWcagAA(ratio, style.fontSize, style.fontWeight);

    if (!result.meetsAA) {
      const rect = element.getBoundingClientRect();
      violations.push({
        type: 'text',
        selector: getSelector(element),
        text: element.textContent?.slice(0, 50) || '',
        color,
        backgroundColor: bgColor,
        ratio: Math.round(ratio * 100) / 100,
        required: result.required,
        fontSize: style.fontSize,
        opacity: opacity < 1 ? opacity : undefined,
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
