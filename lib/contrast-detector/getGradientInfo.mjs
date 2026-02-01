import { extractGradientColors } from './extractGradientColors.mjs';

/**
 * グラデーション背景かどうかを判定し、色情報を返す
 */
export function getGradientInfo(element) {
  let el = element;
  while (el) {
    const style = getComputedStyle(el);
    const bgImage = style.backgroundImage;

    if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
      const colors = extractGradientColors(bgImage);
      if (colors.length > 0) {
        return { isGradient: true, colors };
      }
    }
    el = el.parentElement;
  }
  return { isGradient: false, colors: [] };
}
