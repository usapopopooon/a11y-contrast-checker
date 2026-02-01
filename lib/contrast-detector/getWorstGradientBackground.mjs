import { getColorGrayscale } from './getColorGrayscale.mjs';

/**
 * グラデーション背景に対して最悪（最低コントラスト）の背景色をグレースケール値から判定
 * ブラウザのgrayscale(1)フィルタと同じ変換を使用
 * - 明るいテキスト（白など）: 最も明るい背景色（グレー値高）がワーストケース
 * - 暗いテキスト（黒など）: 最も暗い背景色（グレー値低）がワーストケース
 */
export function getWorstGradientBackground(foregroundColor, gradientColors) {
  if (gradientColors.length === 0) {
    return 'rgb(255, 255, 255)';
  }
  if (gradientColors.length === 1) {
    return gradientColors[0];
  }

  // 前景色のグレースケール値を計算
  const fgGray = getColorGrayscale(foregroundColor);

  // 各背景色のグレースケール値を計算
  const bgGrays = gradientColors.map(getColorGrayscale);

  // 明るいテキスト（グレー値 > 0.5）の場合は最も明るい背景がワースト
  // 暗いテキストの場合は最も暗い背景がワースト
  const isLightForeground = fgGray > 0.5;

  let worstIndex = 0;
  let worstGray = bgGrays[0];

  for (let i = 1; i < bgGrays.length; i++) {
    const gray = bgGrays[i];
    if (isLightForeground) {
      // 明るいテキスト → 最も明るい背景を探す
      if (gray > worstGray) {
        worstGray = gray;
        worstIndex = i;
      }
    } else {
      // 暗いテキスト → 最も暗い背景を探す
      if (gray < worstGray) {
        worstGray = gray;
        worstIndex = i;
      }
    }
  }

  return gradientColors[worstIndex];
}
