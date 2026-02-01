/**
 * グラデーションから色を抽出
 * linear-gradient(to br, color1, color2) の形式から色を取得
 */
export function extractGradientColors(gradient) {
  const colors = [];

  // oklch, rgb, rgba, hsl, hsla, hex, 名前付き色をマッチ
  const colorPatterns = [
    /oklch\([^)]+\)/gi,
    /rgba?\([^)]+\)/gi,
    /hsla?\([^)]+\)/gi,
    /#[0-9a-fA-F]{3,8}\b/gi,
    /\b(red|blue|green|yellow|orange|purple|pink|white|black|gray|grey)\b/gi,
  ];

  for (const pattern of colorPatterns) {
    const matches = gradient.match(pattern);
    if (matches) {
      colors.push(...matches);
    }
  }

  return colors;
}
