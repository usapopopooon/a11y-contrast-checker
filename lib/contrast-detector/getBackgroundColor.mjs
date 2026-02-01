import { extractGradientColors } from './extractGradientColors.mjs';

/**
 * 要素の背景色を取得（親要素を遡って検索、グラデーション非対応版）
 * 注意: グラデーションの場合は最初の色のみ返す。
 * ワーストケース判定が必要な場合はgetGradientInfo + getWorstGradientBackgroundを使用
 */
export function getBackgroundColor(element) {
  let el = element;
  while (el) {
    const style = getComputedStyle(el);
    const bg = style.backgroundColor;
    const bgImage = style.backgroundImage;

    // 通常の背景色をチェック
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }

    // グラデーション背景をチェック
    if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
      const colors = extractGradientColors(bgImage);
      if (colors.length > 0) {
        // グラデーションの最初の色を返す（後でgetWorstGradientBackgroundで調整可能）
        return colors[0];
      }
    }

    el = el.parentElement;
  }
  return 'rgb(255, 255, 255)';
}
