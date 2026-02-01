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
 * 任意のCSS色をRGBAに変換（canvasを使用してoklch等にも対応）
 * @returns {{ r: number, g: number, b: number, a: number } | null}
 */
function parseColorToRgba(color) {
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

/**
 * 後方互換性のためのラッパー関数（アルファなし版）
 */
function parseColorToRgb(color) {
  const rgba = parseColorToRgba(color);
  if (!rgba) return null;
  return { r: rgba.r, g: rgba.g, b: rgba.b };
}

/**
 * 半透明の前景色を背景色にブレンド（アルファ合成）
 * @param {{ r: number, g: number, b: number, a?: number }} fg - 前景色
 * @param {{ r: number, g: number, b: number }} bg - 背景色
 * @returns {{ r: number, g: number, b: number }}
 */
function blendColors(fg, bg) {
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

/**
 * 要素のopacityを考慮した実効アルファを計算
 * 親要素のopacityも累積する
 */
function getEffectiveOpacity(element) {
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

/**
 * CSS色文字列からアルファ値を抽出
 */
function getColorAlpha(color) {
  const rgba = parseColorToRgba(color);
  return rgba ? rgba.a : 1;
}

/**
 * グラデーションから色を抽出
 * linear-gradient(to br, color1, color2) の形式から色を取得
 */
function extractGradientColors(gradient) {
  const colors = [];

  // oklch, rgb, rgba, hsl, hsla, hex, 名前付き色をマッチ
  const colorPatterns = [
    /oklch\([^)]+\)/gi,
    /rgba?\([^)]+\)/gi,
    /hsla?\([^)]+\)/gi,
    /#[0-9a-fA-F]{3,8}\b/gi,
    /\b(red|blue|green|yellow|orange|purple|pink|white|black|gray|grey)\b/gi,
  ];

  for (const pattern of colorPatterns) {
    const matches = gradient.match(pattern);
    if (matches) {
      colors.push(...matches);
    }
  }

  return colors;
}

/**
 * グラデーション背景かどうかを判定し、色情報を返す
 */
function getGradientInfo(element) {
  let el = element;
  while (el) {
    const style = getComputedStyle(el);
    const bgImage = style.backgroundImage;

    if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
      const colors = extractGradientColors(bgImage);
      if (colors.length > 0) {
        return { isGradient: true, colors };
      }
    }
    el = el.parentElement;
  }
  return { isGradient: false, colors: [] };
}

/**
 * ブラウザのgrayscale(1)フィルタを使ってグレー値を取得
 * CSSのgrayscale(1)と同じ変換を使用
 */
function getGrayscaleValue(r, g, b) {
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

/**
 * CSS色文字列からグレースケール値を取得
 */
function getColorGrayscale(color) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return 0;
  return getGrayscaleValue(rgb.r, rgb.g, rgb.b);
}

/**
 * グラデーション背景に対して最悪（最低コントラスト）の背景色をグレースケール値から判定
 * ブラウザのgrayscale(1)フィルタと同じ変換を使用
 * - 明るいテキスト（白など）: 最も明るい背景色（グレー値高）がワーストケース
 * - 暗いテキスト（黒など）: 最も暗い背景色（グレー値低）がワーストケース
 */
function getWorstGradientBackground(foregroundColor, gradientColors) {
  if (gradientColors.length === 0) {
    return 'rgb(255, 255, 255)';
  }
  if (gradientColors.length === 1) {
    return gradientColors[0];
  }

  // 前景色のグレースケール値を計算
  const fgGray = getColorGrayscale(foregroundColor);

  // 各背景色のグレースケール値を計算
  const bgGrays = gradientColors.map(getColorGrayscale);

  // 明るいテキスト（グレー値 > 0.5）の場合は最も明るい背景がワースト
  // 暗いテキストの場合は最も暗い背景がワースト
  const isLightForeground = fgGray > 0.5;

  let worstIndex = 0;
  let worstGray = bgGrays[0];

  for (let i = 1; i < bgGrays.length; i++) {
    const gray = bgGrays[i];
    if (isLightForeground) {
      // 明るいテキスト → 最も明るい背景を探す
      if (gray > worstGray) {
        worstGray = gray;
        worstIndex = i;
      }
    } else {
      // 暗いテキスト → 最も暗い背景を探す
      if (gray < worstGray) {
        worstGray = gray;
        worstIndex = i;
      }
    }
  }

  return gradientColors[worstIndex];
}

/**
 * 要素の背景色を取得（親要素を遡って検索、グラデーション非対応版）
 * 注意: グラデーションの場合は最初の色のみ返す。
 * ワーストケース判定が必要な場合はgetGradientInfo + getWorstGradientBackgroundを使用
 */
function getBackgroundColor(element) {
  let el = element;
  while (el) {
    const style = getComputedStyle(el);
    const bg = style.backgroundColor;
    const bgImage = style.backgroundImage;

    // 通常の背景色をチェック
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }

    // グラデーション背景をチェック
    if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
      const colors = extractGradientColors(bgImage);
      if (colors.length > 0) {
        // グラデーションの最初の色を返す（後でgetWorstGradientBackgroundで調整可能）
        return colors[0];
      }
    }

    el = el.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

/**
 * 2つのCSS色文字列からコントラスト比を計算
 * 半透明色の場合はアルファブレンディングを適用
 */
function getContrastRatio(color1, color2) {
  const rgba1 = parseColorToRgba(color1);
  const rgba2 = parseColorToRgba(color2);
  if (!rgba1 || !rgba2) return 1;

  // 前景色（color1）が半透明の場合、背景色とブレンド
  let effectiveColor1;
  if (rgba1.a < 1) {
    effectiveColor1 = blendColors(rgba1, rgba2);
  } else {
    effectiveColor1 = rgba1;
  }

  const l1 = getLuminance(
    effectiveColor1.r,
    effectiveColor1.g,
    effectiveColor1.b
  );
  const l2 = getLuminance(rgba2.r, rgba2.g, rgba2.b);
  return getContrastRatioFromLuminance(l1, l2);
}

/**
 * opacity考慮版のコントラスト比計算
 * 要素のopacityプロパティも考慮して実際の見た目のコントラストを計算
 */
function getContrastRatioWithOpacity(color1, color2, opacity) {
  const rgba1 = parseColorToRgba(color1);
  const rgba2 = parseColorToRgba(color2);
  if (!rgba1 || !rgba2) return 1;

  // opacityを色のアルファに適用
  const effectiveAlpha = (rgba1.a || 1) * opacity;
  const blendedColor = blendColors({ ...rgba1, a: effectiveAlpha }, rgba2);

  const l1 = getLuminance(blendedColor.r, blendedColor.g, blendedColor.b);
  const l2 = getLuminance(rgba2.r, rgba2.g, rgba2.b);
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
 * 半透明色およびopacityプロパティを考慮
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

    // グラデーション背景の場合はワーストケースを使用
    const gradientInfo = getGradientInfo(element);
    let bgColor;
    if (gradientInfo.isGradient && gradientInfo.colors.length > 0) {
      bgColor = getWorstGradientBackground(color, gradientInfo.colors);
    } else {
      bgColor = getBackgroundColor(element);
    }

    // opacity考慮のコントラスト比計算
    const opacity = getEffectiveOpacity(element);
    const ratio =
      opacity < 1
        ? getContrastRatioWithOpacity(color, bgColor, opacity)
        : getContrastRatio(color, bgColor);
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
        opacity: opacity < 1 ? opacity : undefined,
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
        if (
          ratioVsText < REQUIRED_RATIO_VS_TEXT &&
          ratioVsBg >= REQUIRED_RATIO_VS_BG
        ) {
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
 * ::before / ::after 疑似要素のコントラスト違反を検出
 * content プロパティにテキストがある場合のみチェック
 */
function detectPseudoElementViolations() {
  const violations = [];
  const REQUIRED_RATIO = 4.5;

  // 全ての要素をチェック
  const elements = document.querySelectorAll('*');

  for (const element of elements) {
    for (const pseudo of ['::before', '::after']) {
      const style = getComputedStyle(element, pseudo);
      const content = style.content;

      // contentがテキストを含む場合のみチェック（引用符で囲まれた文字列）
      if (
        content &&
        content !== 'none' &&
        content !== 'normal' &&
        content !== '""' &&
        content !== "''"
      ) {
        // 引用符を除去してテキストを取得
        const textMatch = content.match(/^["'](.+)["']$/);
        if (textMatch && textMatch[1].trim()) {
          const color = style.color;
          const bgColor = getBackgroundColor(element);
          const opacity = getEffectiveOpacity(element);
          const ratio =
            opacity < 1
              ? getContrastRatioWithOpacity(color, bgColor, opacity)
              : getContrastRatio(color, bgColor);

          if (ratio < REQUIRED_RATIO) {
            const rect = element.getBoundingClientRect();
            violations.push({
              type: `pseudo-${pseudo.replace('::', '')}`,
              selector: getSelector(element) + pseudo,
              text: textMatch[1].slice(0, 50),
              color,
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
  }

  return violations;
}

/**
 * CSSフィルターの影響を検出（警告のみ）
 * brightness, contrast, invert, grayscale などのフィルターを検出
 */
function detectFilterWarnings() {
  const warnings = [];
  const filterAffectingContrast =
    /brightness|contrast|invert|grayscale|saturate/i;

  const elements = document.querySelectorAll('*');

  for (const element of elements) {
    const style = getComputedStyle(element);
    const filter = style.filter;

    if (filter && filter !== 'none' && filterAffectingContrast.test(filter)) {
      // テキストを含む要素のみ警告
      if (element.textContent?.trim()) {
        const rect = element.getBoundingClientRect();
        warnings.push({
          type: 'filter-warning',
          selector: getSelector(element),
          text: element.textContent?.slice(0, 50) || '',
          filter: filter,
          note: 'CSSフィルターがコントラストに影響を与える可能性があります',
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

  return warnings;
}

/**
 * mix-blend-mode の影響を検出（警告のみ）
 */
function detectBlendModeWarnings() {
  const warnings = [];

  const elements = document.querySelectorAll('*');

  for (const element of elements) {
    const style = getComputedStyle(element);
    const blendMode = style.mixBlendMode;

    if (blendMode && blendMode !== 'normal') {
      // テキストを含む要素のみ警告
      if (element.textContent?.trim()) {
        const rect = element.getBoundingClientRect();
        warnings.push({
          type: 'blend-mode-warning',
          selector: getSelector(element),
          text: element.textContent?.slice(0, 50) || '',
          blendMode: blendMode,
          note: `mix-blend-mode: ${blendMode} がコントラストに影響を与える可能性があります`,
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

  return warnings;
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
    includePseudoElements = false,
    includeFilterWarnings = false,
    includeBlendModeWarnings = false,
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

  if (includePseudoElements) {
    violations.push(...detectPseudoElementViolations());
  }

  if (includeFilterWarnings) {
    violations.push(...detectFilterWarnings());
  }

  if (includeBlendModeWarnings) {
    violations.push(...detectBlendModeWarnings());
  }

  return violations;
}

// グローバルに公開（ブラウザ用 - E2Eテストのスクリプト注入で使用）
if (typeof window !== 'undefined') {
  window.ContrastDetector = {
    getLuminance,
    getContrastRatioFromLuminance,
    getContrastRatio,
    getContrastRatioWithOpacity,
    getBackgroundColor,
    getGradientInfo,
    getWorstGradientBackground,
    extractGradientColors,
    parseColorToRgb,
    parseColorToRgba,
    blendColors,
    getEffectiveOpacity,
    getColorAlpha,
    isLargeText,
    checkWcagAA,
    getSelector,
    detectTextViolations,
    detectUIComponentViolations,
    detectIconViolations,
    detectPlaceholderViolations,
    detectLinkViolations,
    detectPseudoElementViolations,
    detectFilterWarnings,
    detectBlendModeWarnings,
    detectViolations,
  };
  // E2Eテスト用にグローバル関数として公開
  window.detectViolations = detectViolations;
}
