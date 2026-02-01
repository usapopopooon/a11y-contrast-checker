/**
 * Tailwind CSS変数からringの色を取得
 */
export const getTailwindRingColor = (element: Element): string | null => {
  if (!(element instanceof HTMLElement)) return null;
  const style = getComputedStyle(element);

  // Tailwind v4 uses --tw-ring-color CSS variable
  const ringColor = style.getPropertyValue('--tw-ring-color').trim();
  if (ringColor && ringColor !== '' && ringColor !== 'initial') {
    return ringColor;
  }

  // Also check --tw-ring-shadow which contains the full shadow definition
  const ringShadow = style.getPropertyValue('--tw-ring-shadow').trim();
  if (ringShadow && ringShadow !== '' && ringShadow !== '0 0 #0000') {
    // Extract color from the shadow definition
    const colorMatch = ringShadow.match(
      /oklch\([^)]+\)|rgba?\([^)]+\)|hsla?\([^)]+\)|color\([^)]+\)|#[0-9a-fA-F]{3,8}\b/i
    );
    if (colorMatch) {
      return colorMatch[0];
    }
  }

  return null;
};
