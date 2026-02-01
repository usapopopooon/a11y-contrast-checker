import { getSelector } from './getSelector.mjs';

/**
 * mix-blend-mode の影響を検出（警告のみ）
 */
export function detectBlendModeWarnings() {
  const warnings = [];

  const elements = document.querySelectorAll('*');

  for (const element of elements) {
    const style = getComputedStyle(element);
    const blendMode = style.mixBlendMode;

    if (blendMode && blendMode !== 'normal') {
      // テキストを含む要素のみ警告
      if (element.textContent?.trim()) {
        const rect = element.getBoundingClientRect();
        warnings.push({
          type: 'blend-mode-warning',
          selector: getSelector(element),
          text: element.textContent?.slice(0, 50) || '',
          blendMode: blendMode,
          note: `mix-blend-mode: ${blendMode} がコントラストに影響を与える可能性があります`,
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
