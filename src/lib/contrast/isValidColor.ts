/**
 * 色が有効かどうか判定（透明や未設定でない）
 */
export const isValidColor = (
  color: string | null | undefined
): color is string => {
  if (!color) return false;
  if (color === 'rgba(0, 0, 0, 0)') return false;
  if (color === 'transparent') return false;
  if (color === 'none') return false;
  return true;
};
