/**
 * 検知結果が有効かどうか判定
 */
export const isValidDetection = (ratio: number): boolean => {
  return ratio > 1.05 && ratio <= 21;
};
