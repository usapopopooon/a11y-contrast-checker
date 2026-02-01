import { getSelector } from './getSelector.mjs';

/**
 * CSSフィルターの影響を検出（警告のみ）
 * brightness, contrast, invert, grayscale などのフィルターを検出
 */
export function detectFilterWarnings() {
  const warnings = [];
  const filterAffectingContrast =
    /brightness|contrast|invert|grayscale|saturate/i;

  const elements = document.querySelectorAll('*');

  for (const element of elements) {
    const style = getComputedStyle(element);
    const filter = style.filter;

    if (filter && filter !== 'none' && filterAffectingContrast.test(filter)) {
      // テキストを含む要素のみ警告
      if (element.textContent?.trim()) {
        const rect = element.getBoundingClientRect();
        warnings.push({
          type: 'filter-warning',
          selector: getSelector(element),
          text: element.textContent?.slice(0, 50) || '',
          filter: filter,
          note: 'CSSフィルターがコントラストに影響を与える可能性があります',
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

  return warnings;
}
