/**
 * WCAG 2.1 コントラスト比検出ライブラリ
 * CI/E2Eテスト用の生JavaScript版
 */

/**
 * sRGB値（0-255）を相対輝度（0-1）に変換
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 2つの相対輝度からコントラスト比を計算（1:1 〜 21:1）
 */
function getContrastRatioFromLuminance(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 任意のCSS色をRGBに変換（canvasを使用してoklch等にも対応）
 */
function parseColorToRgb(color) {
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
function getBackgroundColor(element) {
  let el = element;
  while (el) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    el = el.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

/**
 * 2つのCSS色文字列からコントラスト比を計算
 */
function getContrastRatio(color1, color2) {
  const rgb1 = parseColorToRgb(color1);
  const rgb2 = parseColorToRgb(color2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  return getContrastRatioFromLuminance(l1, l2);
}

/**
 * 大きいテキストかどうか判定
 */
function isLargeText(fontSize, fontWeight) {
  const size = parseFloat(fontSize);
  const weight = parseInt(fontWeight, 10);
  const pt = size * 0.75;
  return pt >= 18 || (pt >= 14 && weight >= 700);
}

/**
 * WCAG AA基準判定
 */
function checkWcagAA(ratio, fontSize, fontWeight) {
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
 * CSSセレクタを生成
 */
function getSelector(element) {
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

/**
 * テキストのコントラスト違反を検出
 */
function detectTextViolations() {
  const violations = [];

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

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const checkedElements = new Set();

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
        type: 'text',
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

/**
 * UIコンポーネント（ボタン・フォーム）の境界線コントラスト違反を検出
 * WCAG 1.4.11 非テキストコントラスト: 3:1以上
 */
function detectUIComponentViolations() {
  const violations = [];
  const REQUIRED_RATIO = 3.0;

  // フォーム要素とボタンを取得
  const elements = document.querySelectorAll(
    'input, button, select, textarea, [role="button"], [role="checkbox"], [role="radio"]'
  );

  for (const element of elements) {
    const style = getComputedStyle(element);
    const bgColor = getBackgroundColor(element);

    // border-colorをチェック（境界線が見える場合）
    const borderWidth = parseFloat(style.borderWidth);
    if (borderWidth > 0 && style.borderStyle !== 'none') {
      const borderColor = style.borderColor;
      const ratio = getContrastRatio(borderColor, bgColor);

      if (ratio < REQUIRED_RATIO) {
        const rect = element.getBoundingClientRect();
        violations.push({
          type: 'ui-border',
          selector: getSelector(element),
          text: element.tagName.toLowerCase(),
          color: borderColor,
          backgroundColor: bgColor,
          ratio: Math.round(ratio * 100) / 100,
          required: REQUIRED_RATIO,
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
        });
      }
    }
  }

  return violations;
}

/**
 * SVGアイコンのコントラスト違反を検出
 * WCAG 1.4.11 非テキストコントラスト: 3:1以上
 */
function detectIconViolations() {
  const violations = [];
  const REQUIRED_RATIO = 3.0;

  // SVG要素を取得
  const svgs = document.querySelectorAll('svg');

  for (const svg of svgs) {
    const style = getComputedStyle(svg);
    const bgColor = getBackgroundColor(svg);

    // fill または stroke をチェック
    const fill = style.fill;
    const stroke = style.stroke;

    // fillが有効な色の場合
    if (fill && fill !== 'none' && fill !== 'transparent') {
      const ratio = getContrastRatio(fill, bgColor);
      if (ratio < REQUIRED_RATIO) {
        const rect = svg.getBoundingClientRect();
        // 小さすぎるSVGは装飾的とみなしてスキップ
        if (rect.width >= 16 && rect.height >= 16) {
          violations.push({
            type: 'icon-fill',
            selector: getSelector(svg),
            text: 'SVG icon',
            color: fill,
            backgroundColor: bgColor,
            ratio: Math.round(ratio * 100) / 100,
            required: REQUIRED_RATIO,
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
          });
        }
      }
    }

    // strokeが有効な色の場合
    if (stroke && stroke !== 'none' && stroke !== 'transparent') {
      const ratio = getContrastRatio(stroke, bgColor);
      if (ratio < REQUIRED_RATIO) {
        const rect = svg.getBoundingClientRect();
        if (rect.width >= 16 && rect.height >= 16) {
          violations.push({
            type: 'icon-stroke',
            selector: getSelector(svg),
            text: 'SVG icon',
            color: stroke,
            backgroundColor: bgColor,
            ratio: Math.round(ratio * 100) / 100,
            required: REQUIRED_RATIO,
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
          });
        }
      }
    }
  }

  return violations;
}

/**
 * プレースホルダーのコントラスト違反を検出
 * WCAG 1.4.3: 4.5:1以上
 */
function detectPlaceholderViolations() {
  const violations = [];
  const REQUIRED_RATIO = 4.5;

  const inputs = document.querySelectorAll(
    'input[placeholder], textarea[placeholder]'
  );

  for (const input of inputs) {
    const placeholder = input.getAttribute('placeholder');
    if (!placeholder) continue;

    // プレースホルダーの色を取得（::placeholder疑似要素）
    const style = getComputedStyle(input, '::placeholder');
    const placeholderColor = style.color;
    const bgColor = getBackgroundColor(input);
    const ratio = getContrastRatio(placeholderColor, bgColor);

    if (ratio < REQUIRED_RATIO) {
      const rect = input.getBoundingClientRect();
      violations.push({
        type: 'placeholder',
        selector: getSelector(input),
        text: placeholder.slice(0, 50),
        color: placeholderColor,
        backgroundColor: bgColor,
        ratio: Math.round(ratio * 100) / 100,
        required: REQUIRED_RATIO,
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

/**
 * リンクのコントラスト違反を検出
 * WCAG 1.4.1: リンクは周囲のテキストと3:1以上の差、または下線で区別
 */
function detectLinkViolations() {
  const violations = [];
  const REQUIRED_RATIO_VS_BG = 4.5;
  const REQUIRED_RATIO_VS_TEXT = 3.0;

  const links = document.querySelectorAll('a');

  for (const link of links) {
    const style = getComputedStyle(link);
    const linkColor = style.color;
    const bgColor = getBackgroundColor(link);
    const textDecoration = style.textDecorationLine;
    const hasUnderline = textDecoration.includes('underline');

    // 背景とのコントラストをチェック
    const ratioVsBg = getContrastRatio(linkColor, bgColor);

    if (ratioVsBg < REQUIRED_RATIO_VS_BG) {
      const rect = link.getBoundingClientRect();
      violations.push({
        type: 'link',
        selector: getSelector(link),
        text: link.textContent?.slice(0, 50) || '',
        color: linkColor,
        backgroundColor: bgColor,
        ratio: Math.round(ratioVsBg * 100) / 100,
        required: REQUIRED_RATIO_VS_BG,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      });
    }

    // 下線がない場合、周囲テキストとの区別もチェック
    if (!hasUnderline) {
      const parent = link.parentElement;
      if (parent) {
        const parentColor = getComputedStyle(parent).color;
        const ratioVsText = getContrastRatio(linkColor, parentColor);
        if (ratioVsText < REQUIRED_RATIO_VS_TEXT && ratioVsBg >= REQUIRED_RATIO_VS_BG) {
          const rect = link.getBoundingClientRect();
          violations.push({
            type: 'link-distinction',
            selector: getSelector(link),
            text: link.textContent?.slice(0, 50) || '',
            color: linkColor,
            backgroundColor: parentColor,
            ratio: Math.round(ratioVsText * 100) / 100,
            required: REQUIRED_RATIO_VS_TEXT,
            note: '下線なしで周囲テキストと区別不足',
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
          });
        }
      }
    }
  }

  return violations;
}

/**
 * ページ全体のコントラスト違反を検出（テキスト + 非テキスト）
 */
function detectViolations(options = {}) {
  const {
    includeText = true,
    includeUI = true,
    includeIcons = true,
    includePlaceholders = true,
    includeLinks = true,
  } = options;

  const violations = [];

  if (includeText) {
    violations.push(...detectTextViolations());
  }

  if (includeUI) {
    violations.push(...detectUIComponentViolations());
  }

  if (includeIcons) {
    violations.push(...detectIconViolations());
  }

  if (includePlaceholders) {
    violations.push(...detectPlaceholderViolations());
  }

  if (includeLinks) {
    violations.push(...detectLinkViolations());
  }

  return violations;
}

// グローバルに公開（ブラウザ用）
if (typeof window !== 'undefined') {
  window.ContrastDetector = {
    getLuminance,
    getContrastRatio,
    getBackgroundColor,
    parseColorToRgb,
    isLargeText,
    checkWcagAA,
    getSelector,
    detectTextViolations,
    detectUIComponentViolations,
    detectIconViolations,
    detectPlaceholderViolations,
    detectLinkViolations,
    detectViolations,
  };
}

// Node.js用エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLuminance,
    getContrastRatio,
    getBackgroundColor,
    parseColorToRgb,
    isLargeText,
    checkWcagAA,
    getSelector,
    detectTextViolations,
    detectUIComponentViolations,
    detectIconViolations,
    detectPlaceholderViolations,
    detectLinkViolations,
    detectViolations,
  };
}
