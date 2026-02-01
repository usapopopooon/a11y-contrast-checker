/**
 * 要素のopacityを考慮した実効アルファを計算
 * 親要素のopacityも累積する
 */
export function getEffectiveOpacity(element) {
  let opacity = 1;
  let el = element;
  while (el && el !== document.documentElement) {
    const style = getComputedStyle(el);
    const elOpacity = parseFloat(style.opacity);
    if (!isNaN(elOpacity)) {
      opacity *= elOpacity;
    }
    el = el.parentElement;
  }
  return opacity;
}
