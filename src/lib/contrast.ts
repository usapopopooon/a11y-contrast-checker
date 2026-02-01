/**
 * WCAG 2.1 コントラスト比計算ロジック
 * ReactアプリとPlaywright E2Eテストの両方で使用可能
 */

export interface WcagResult {
  ratio: number;
  isLargeText: boolean;
  meetsAA: boolean;
  required: number;
}

export interface Violation {
  selector: string;
  text: string;
  color: string;
  backgroundColor: string;
  ratio: number;
  required: number;
  fontSize: string;
  rect: { x: number; y: number; width: number; height: number };
}

export interface DetectionResult {
  detected: boolean;
  ratio: number;
  color: string;
  bgColor: string;
}

/**
 * sRGB値（0-255）を相対輝度（0-1）に変換
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 2つの相対輝度からコントラスト比を計算（1:1 〜 21:1）
 */
export function getContrastRatioFromLuminance(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 任意のCSS色をRGBに変換（canvasを使用してoklch等にも対応）
 */
export function parseColorToRgb(
  color: string
): { r: number; g: number; b: number } | null {
  // rgb/rgba形式を直接パース
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }

  // oklch等の他の形式はcanvasで変換
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const imageData = ctx.getImageData(0, 0, 1, 1);
  const [r, g, b] = imageData.data;

  return { r, g, b };
}

/**
 * 要素の背景色を取得（親要素を遡って検索）
 */
export function getBackgroundColor(element: Element): string {
  let el: Element | null = element;
  while (el) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    el = el.parentElement;
  }
  return 'rgb(255, 255, 255)'; // デフォルトは白
}

/**
 * 2つのCSS色文字列からコントラスト比を計算
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseColorToRgb(color1);
  const rgb2 = parseColorToRgb(color2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  return getContrastRatioFromLuminance(l1, l2);
}

/**
 * 大きいテキストかどうか判定
 * 大きいテキスト: 18pt以上、または14pt以上かつbold
 */
export function isLargeText(fontSize: string, fontWeight: string): boolean {
  const size = parseFloat(fontSize);
  const weight = parseInt(fontWeight, 10);
  const pt = size * 0.75; // px to pt (概算)
  return pt >= 18 || (pt >= 14 && weight >= 700);
}

/**
 * WCAG AA基準判定
 */
export function checkWcagAA(
  ratio: number,
  fontSize: string,
  fontWeight: string
): WcagResult {
  const large = isLargeText(fontSize, fontWeight);
  const required = large ? 3.0 : 4.5;
  return {
    ratio,
    isLargeText: large,
    meetsAA: ratio >= required,
    required,
  };
}

/**
 * 要素のコントラストを検知
 */
export function detectContrast(element: Element): DetectionResult {
  const style = getComputedStyle(element);
  const color = style.color;
  const bgColor = getBackgroundColor(element);
  const ratio = getContrastRatio(color, bgColor);

  return {
    detected: true,
    ratio: Math.round(ratio * 100) / 100,
    color,
    bgColor,
  };
}

/**
 * CSSセレクタを生成
 */
export function getSelector(element: Element): string {
  if (element.id) return `#${element.id}`;
  const parts: string[] = [];
  let el: Element | null = element;
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

/**
 * ページ全体のコントラスト違反を検出
 */
export function detectViolations(): Violation[] {
  const violations: Violation[] = [];

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const text = node.textContent?.trim();
        return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  const checkedElements = new Set<Element>();

  for (const textNode of textNodes) {
    const element = textNode.parentElement;
    if (!element || checkedElements.has(element)) continue;
    checkedElements.add(element);

    const style = getComputedStyle(element);
    const color = style.color;
    const bgColor = getBackgroundColor(element);
    const ratio = getContrastRatio(color, bgColor);
    const result = checkWcagAA(ratio, style.fontSize, style.fontWeight);

    if (!result.meetsAA) {
      const rect = element.getBoundingClientRect();
      violations.push({
        selector: getSelector(element),
        text: element.textContent?.slice(0, 50) || '',
        color,
        backgroundColor: bgColor,
        ratio: Math.round(ratio * 100) / 100,
        required: result.required,
        fontSize: style.fontSize,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      });
    }
  }

  return violations;
}
