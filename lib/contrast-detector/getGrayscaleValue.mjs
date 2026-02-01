/**
 * ブラウザのgrayscale(1)フィルタを使ってグレー値を取得
 * CSSのgrayscale(1)と同じ変換を使用
 */
export function getGrayscaleValue(r, g, b) {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  ctx.filter = 'grayscale(1)';
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 1, 1);
  const pixel = ctx.getImageData(0, 0, 1, 1).data;
  return pixel[0] / 255;
}
