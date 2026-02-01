/**
 * 検知結果が基準をクリアしているか判定（純粋関数）
 */
export const meetsRequirement = (ratio: number, required: number): boolean =>
  ratio >= required;
