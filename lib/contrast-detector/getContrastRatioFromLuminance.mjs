/**
 * 2つの相対輝度からコントラスト比を計算（1:1 〜 21:1）
 */
export function getContrastRatioFromLuminance(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
