import { isValidColor } from './isValidColor';
import { extractBoxShadowColor } from './extractBoxShadowColor';
import { extractRingShadowFromBoxShadow } from './extractRingShadowFromBoxShadow';
import { getTailwindRingColor } from './getTailwindRingColor';
import { waitForStyleStable } from './waitForStyleStable';

/**
 * フォーカスリングの色を検知（非同期版）
 */
export const detectFocusRingColorAsync = async (
  element: Element,
  options: { timeout?: number } = {}
): Promise<{
  color: string;
  type: 'outline' | 'box-shadow' | 'ring';
} | null> => {
  const { timeout = 150 } = options;

  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const previouslyFocused = document.activeElement;

  try {
    element.focus({ preventScroll: true });
    await waitForStyleStable(element, { timeout, interval: 20, checkCount: 2 });

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
      element.blur();
    }
  }
};
