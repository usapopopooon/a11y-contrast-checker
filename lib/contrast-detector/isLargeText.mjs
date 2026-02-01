/**
 * 大きいテキストかどうか判定
 */
export function isLargeText(fontSize, fontWeight) {
  const size = parseFloat(fontSize);
  const weight = parseInt(fontWeight, 10);
  const pt = size * 0.75;
  return pt >= 18 || (pt >= 14 && weight >= 700);
}
