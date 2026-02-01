/**
 * 半透明の前景色を背景色にブレンド（アルファ合成）
 * @param {{ r: number, g: number, b: number, a?: number }} fg - 前景色
 * @param {{ r: number, g: number, b: number }} bg - 背景色
 * @returns {{ r: number, g: number, b: number }}
 */
export function blendColors(fg, bg) {
  const alpha = fg.a !== undefined ? fg.a : 1;
  if (alpha >= 1) {
    return { r: fg.r, g: fg.g, b: fg.b };
  }
  if (alpha <= 0) {
    return { r: bg.r, g: bg.g, b: bg.b };
  }
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
  };
}
