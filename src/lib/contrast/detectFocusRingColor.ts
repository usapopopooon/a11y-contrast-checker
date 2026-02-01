import { isValidColor } from './isValidColor';
import { extractBoxShadowColor } from './extractBoxShadowColor';
import { extractRingShadowFromBoxShadow } from './extractRingShadowFromBoxShadow';
import { getTailwindRingColor } from './getTailwindRingColor';

/**
 * フォーカスリングの色を検知（同期版）
 */
export const detectFocusRingColor = (
  element: Element
): { color: string; type: 'outline' | 'box-shadow' | 'ring' } | null => {
  if (!(element instanceof HTMLElement)) return null;

  const previouslyFocused = document.activeElement;

  try {
    element.focus();
    const style = getComputedStyle(element);

    // 1. Check outline first
    const outlineWidth = parseFloat(style.outlineWidth);
    const outlineColor = style.outlineColor;
    if (outlineWidth > 0 && isValidColor(outlineColor)) {
      return { color: outlineColor, type: 'outline' };
    }

    // 2. Check box-shadow (ring creates box-shadow)
    const boxShadow = style.boxShadow;
    // First try to extract ring-specific shadow (0 0 0 Npx pattern)
    const ringShadowColor = extractRingShadowFromBoxShadow(boxShadow);
    if (ringShadowColor) {
      return { color: ringShadowColor, type: 'box-shadow' };
    }
    // Fall back to generic box-shadow color extraction
    const shadowColor = extractBoxShadowColor(boxShadow);
    if (shadowColor && isValidColor(shadowColor)) {
      return { color: shadowColor, type: 'box-shadow' };
    }

    // 3. Check Tailwind CSS variable --tw-ring-color (fallback for edge cases)
    const ringColor = getTailwindRingColor(element);
    if (ringColor && isValidColor(ringColor)) {
      return { color: ringColor, type: 'ring' };
    }

    return null;
  } finally {
    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    } else {
      (element as HTMLElement).blur();
    }
  }
};
