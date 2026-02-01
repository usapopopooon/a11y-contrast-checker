/**
 * CSSセレクタを生成
 */
export function getSelector(element) {
  if (element.id) return `#${element.id}`;
  const parts = [];
  let el = element;
  while (el && el !== document.body) {
    let selector = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(/\s+/).filter(Boolean).slice(0, 2);
      selector += classes.map((c) => `.${c}`).join('');
    }
    parts.unshift(selector);
    el = el.parentElement;
  }
  return parts.join(' > ');
}
