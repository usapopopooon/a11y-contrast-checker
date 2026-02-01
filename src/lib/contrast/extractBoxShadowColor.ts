/**
 * box-shadowから色を抽出
 */
export const extractBoxShadowColor = (boxShadow: string): string | null => {
  if (!boxShadow || boxShadow === 'none') return null;
  // oklch, rgb, rgba, hsl, hsla, color(), lab(), lch(), #hex をマッチ
  const colorMatch = boxShadow.match(
    /oklch\([^)]+\)|rgba?\([^)]+\)|hsla?\([^)]+\)|color\([^)]+\)|lab\([^)]+\)|lch\([^)]+\)|#[0-9a-fA-F]{3,8}\b/i
  );
  return colorMatch ? colorMatch[0] : null;
};
