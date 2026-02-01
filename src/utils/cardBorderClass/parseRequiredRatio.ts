/**
 * 基準値をパース（純粋関数）
 */
export const parseRequiredRatio = (requiredRatio: string): number | null => {
  const num = parseFloat(requiredRatio);
  return isNaN(num) ? null : num;
};
