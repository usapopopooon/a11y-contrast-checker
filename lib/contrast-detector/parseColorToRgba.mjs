/**
 * 任意のCSS色をRGBAに変換（canvasを使用してoklch等にも対応）
 * @returns {{ r: number, g: number, b: number, a: number } | null}
 */
export function parseColorToRgba(color) {
  // rgb/rgba形式を直接パース
  const rgbaMatch = color.match(
    /rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*(\d+(?:\.\d+)?%?|\d*\.\d+))?\)/
  );
  if (rgbaMatch) {
    let alpha = 1;
    if (rgbaMatch[4] !== undefined) {
      const alphaStr = rgbaMatch[4];
      if (alphaStr.endsWith('%')) {
        alpha = parseFloat(alphaStr) / 100;
      } else {
        alpha = parseFloat(alphaStr);
      }
    }
    return {
      r: Number(rgbaMatch[1]),
      g: Number(rgbaMatch[2]),
      b: Number(rgbaMatch[3]),
      a: alpha,
    };
  }

  // oklch等の他の形式はcanvasで変換（アルファも取得）
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const imageData = ctx.getImageData(0, 0, 1, 1);
  const [r, g, b, a] = imageData.data;

  return { r, g, b, a: a / 255 };
}
