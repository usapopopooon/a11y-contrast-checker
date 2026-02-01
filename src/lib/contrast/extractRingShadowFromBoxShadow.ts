import { isValidColor } from './isValidColor';

/**
 * CSSのbox-shadowプロパティを解析してリング関連のシャドウを検出
 * Tailwind v4のbox-shadowは複数のシャドウをカンマで結合している
 */
export const extractRingShadowFromBoxShadow = (
  boxShadow: string
): string | null => {
  if (!boxShadow || boxShadow === 'none') return null;

  // Tailwind's ring shadow pattern: 0 0 0 Npx <color> (inset optional)
  // The ring creates a solid shadow with 0 blur
  const shadows = boxShadow.split(/,(?![^()]*\))/); // Split by comma, but not inside parentheses

  for (const shadow of shadows) {
    const trimmed = shadow.trim();
    // Check if this looks like a ring shadow (0 0 0 Npx color)
    if (
      /^(inset\s+)?0(px)?\s+0(px)?\s+0(px)?\s+\d+(\.\d+)?(px)?/i.test(trimmed)
    ) {
      const colorMatch = trimmed.match(
        /oklch\([^)]+\)|rgba?\([^)]+\)|hsla?\([^)]+\)|color\([^)]+\)|#[0-9a-fA-F]{3,8}\b/i
      );
      if (colorMatch && isValidColor(colorMatch[0])) {
        return colorMatch[0];
      }
    }
  }

  return null;
};
