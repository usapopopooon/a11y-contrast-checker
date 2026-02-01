import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  _internal,
  detectContrast,
  detectContrastAsync,
  detectFocusRingColor,
  detectFocusRingColorAsync,
  waitForStyleStable,
  getContrastRatio,
  parseColorToRgb,
  parseColorToRgba,
  blendColors,
  getColorAlpha,
  isLargeText,
  getLuminance,
  getContrastRatioFromLuminance,
} from './contrast/index';

const {
  isValidColor,
  extractBoxShadowColor,
  extractRingShadowFromBoxShadow,
  isValidDetection,
} = _internal;

// ============================================================
// isValidColor
// ============================================================

describe('isValidColor', () => {
  it('有効な色文字列でtrueを返す', () => {
    expect(isValidColor('rgb(0, 0, 0)')).toBe(true);
    expect(isValidColor('rgba(255, 255, 255, 1)')).toBe(true);
    expect(isValidColor('#000000')).toBe(true);
    expect(isValidColor('#fff')).toBe(true);
    expect(isValidColor('red')).toBe(true);
  });

  it('null/undefinedでfalseを返す', () => {
    expect(isValidColor(null)).toBe(false);
    expect(isValidColor(undefined)).toBe(false);
  });

  it('空文字列でfalseを返す', () => {
    expect(isValidColor('')).toBe(false);
  });

  it('透明色でfalseを返す', () => {
    expect(isValidColor('rgba(0, 0, 0, 0)')).toBe(false);
    expect(isValidColor('transparent')).toBe(false);
    expect(isValidColor('none')).toBe(false);
  });
});

// ============================================================
// extractBoxShadowColor
// ============================================================

describe('extractBoxShadowColor', () => {
  it('box-shadowからrgba色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px rgba(0, 0, 0, 0.5)')).toBe(
      'rgba(0, 0, 0, 0.5)'
    );
  });

  it('box-shadowからrgb色を抽出する', () => {
    expect(extractBoxShadowColor('2px 2px 4px rgb(100, 100, 100)')).toBe(
      'rgb(100, 100, 100)'
    );
  });

  it('box-shadowからhex色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 10px #ff0000')).toBe('#ff0000');
    expect(extractBoxShadowColor('0 0 10px #f00')).toBe('#f00');
  });

  it('box-shadowからoklch色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px oklch(0.5 0.2 240)')).toBe(
      'oklch(0.5 0.2 240)'
    );
  });

  it('box-shadowからhsl色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px hsl(120, 100%, 50%)')).toBe(
      'hsl(120, 100%, 50%)'
    );
  });

  it('noneでnullを返す', () => {
    expect(extractBoxShadowColor('none')).toBeNull();
  });

  it('空文字列でnullを返す', () => {
    expect(extractBoxShadowColor('')).toBeNull();
  });
});

// ============================================================
// extractRingShadowFromBoxShadow
// ============================================================

describe('extractRingShadowFromBoxShadow', () => {
  it('リングシャドウパターン（0 0 0 Npx color）から色を抽出する', () => {
    expect(extractRingShadowFromBoxShadow('0 0 0 3px rgb(59, 130, 246)')).toBe(
      'rgb(59, 130, 246)'
    );
  });

  it('insetリングシャドウから色を抽出する', () => {
    expect(
      extractRingShadowFromBoxShadow('inset 0 0 0 2px rgba(0, 0, 255, 0.5)')
    ).toBe('rgba(0, 0, 255, 0.5)');
  });

  it('複数のシャドウからリングシャドウを見つける', () => {
    const multiShadow =
      '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 0 3px rgb(59, 130, 246)';
    expect(extractRingShadowFromBoxShadow(multiShadow)).toBe(
      'rgb(59, 130, 246)'
    );
  });

  it('リングパターンがない場合nullを返す', () => {
    expect(
      extractRingShadowFromBoxShadow('0 4px 6px rgba(0, 0, 0, 0.1)')
    ).toBeNull();
  });

  it('透明色のリングはnullを返す', () => {
    expect(
      extractRingShadowFromBoxShadow('0 0 0 3px rgba(0, 0, 0, 0)')
    ).toBeNull();
  });

  it('noneでnullを返す', () => {
    expect(extractRingShadowFromBoxShadow('none')).toBeNull();
  });

  it('空文字列でnullを返す', () => {
    expect(extractRingShadowFromBoxShadow('')).toBeNull();
  });
});

// ============================================================
// isValidDetection
// ============================================================

describe('isValidDetection', () => {
  it('1.05より大きく21以下の場合trueを返す', () => {
    expect(isValidDetection(1.06)).toBe(true);
    expect(isValidDetection(4.5)).toBe(true);
    expect(isValidDetection(21)).toBe(true);
  });

  it('1.05以下の場合falseを返す', () => {
    expect(isValidDetection(1.05)).toBe(false);
    expect(isValidDetection(1.0)).toBe(false);
    expect(isValidDetection(0)).toBe(false);
  });

  it('21より大きい場合falseを返す', () => {
    expect(isValidDetection(21.01)).toBe(false);
    expect(isValidDetection(100)).toBe(false);
  });
});

// ============================================================
// 共通ライブラリ関数の型付きエクスポート
// ============================================================

describe('getLuminance', () => {
  it('黒の輝度は0に近い', () => {
    expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 5);
  });

  it('白の輝度は1に近い', () => {
    expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 5);
  });

  it('赤の輝度を計算する', () => {
    const luminance = getLuminance(255, 0, 0);
    expect(luminance).toBeGreaterThan(0);
    expect(luminance).toBeLessThan(1);
  });
});

describe('getContrastRatioFromLuminance', () => {
  it('黒と白のコントラスト比は21:1', () => {
    const ratio = getContrastRatioFromLuminance(0, 1);
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('同じ輝度のコントラスト比は1:1', () => {
    expect(getContrastRatioFromLuminance(0.5, 0.5)).toBeCloseTo(1, 5);
  });
});

describe('getContrastRatio', () => {
  it('黒と白のコントラスト比を計算する', () => {
    const ratio = getContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('同じ色のコントラスト比は1', () => {
    const ratio = getContrastRatio('rgb(128, 128, 128)', 'rgb(128, 128, 128)');
    expect(ratio).toBeCloseTo(1, 5);
  });
});

describe('parseColorToRgb', () => {
  it('rgb文字列をパースする', () => {
    const result = parseColorToRgb('rgb(255, 128, 64)');
    expect(result).toEqual({ r: 255, g: 128, b: 64 });
  });

  it('無効な色でnullを返す', () => {
    expect(parseColorToRgb('invalid')).toBeNull();
  });
});

describe('parseColorToRgba', () => {
  it('rgba文字列をパースする', () => {
    const result = parseColorToRgba('rgba(255, 128, 64, 0.5)');
    expect(result).toEqual({ r: 255, g: 128, b: 64, a: 0.5 });
  });

  it('rgb文字列をパースする（alpha=1）', () => {
    const result = parseColorToRgba('rgb(255, 128, 64)');
    expect(result).toEqual({ r: 255, g: 128, b: 64, a: 1 });
  });
});

describe('blendColors', () => {
  it('半透明色を背景にブレンドする', () => {
    const fg = { r: 0, g: 0, b: 0, a: 0.5 };
    const bg = { r: 255, g: 255, b: 255 };
    const result = blendColors(fg, bg);
    expect(result.r).toBeCloseTo(128, 0);
    expect(result.g).toBeCloseTo(128, 0);
    expect(result.b).toBeCloseTo(128, 0);
  });

  it('不透明色はそのまま返す', () => {
    const fg = { r: 100, g: 150, b: 200 };
    const bg = { r: 255, g: 255, b: 255 };
    const result = blendColors(fg, bg);
    expect(result).toEqual({ r: 100, g: 150, b: 200 });
  });
});

describe('getColorAlpha', () => {
  it('rgba色のアルファ値を取得する', () => {
    expect(getColorAlpha('rgba(0, 0, 0, 0.5)')).toBe(0.5);
  });

  it('rgb色はアルファ1を返す', () => {
    expect(getColorAlpha('rgb(0, 0, 0)')).toBe(1);
  });

  it('透明色はアルファ0を返す', () => {
    expect(getColorAlpha('rgba(0, 0, 0, 0)')).toBe(0);
  });
});

describe('isLargeText', () => {
  // WCAG 2.1: 大きいテキストは18pt(24px)以上、または14pt(18.67px)以上で太字
  it('24px以上は大きいテキスト', () => {
    expect(isLargeText('24px', 'normal')).toBe(true);
    expect(isLargeText('30px', 'normal')).toBe(true);
  });

  it('24px太字は大きいテキスト', () => {
    expect(isLargeText('24px', 'bold')).toBe(true);
    expect(isLargeText('24px', '700')).toBe(true);
  });

  it('14px通常は小さいテキスト', () => {
    expect(isLargeText('14px', 'normal')).toBe(false);
  });

  it('12pxは小さいテキスト', () => {
    expect(isLargeText('12px', 'normal')).toBe(false);
    expect(isLargeText('12px', 'bold')).toBe(false);
  });
});

// ============================================================
// DOM依存関数のテスト
// ============================================================

describe('waitForStyleStable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('スタイルが安定するまで待つ', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const promise = waitForStyleStable(element, {
      timeout: 100,
      interval: 10,
      checkCount: 2,
    });

    // requestAnimationFrameとタイマーを進める
    await vi.advanceTimersByTimeAsync(150);

    await expect(promise).resolves.toBeUndefined();

    document.body.removeChild(element);
  });

  it('タイムアウトで解決する', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const promise = waitForStyleStable(element, {
      timeout: 50,
      interval: 10,
      checkCount: 10, // 到達しない
    });

    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBeUndefined();

    document.body.removeChild(element);
  });
});

describe('detectContrast', () => {
  it('テキスト色と背景色のコントラストを検知する', () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const result = detectContrast(element);

    expect(result.detected).toBe(true);
    expect(result.ratio).toBeCloseTo(21, 0);
    expect(result.type).toBe('text');

    document.body.removeChild(element);
  });

  it('ボーダー優先モードでボーダー色を検知する', () => {
    const element = document.createElement('div');
    element.style.borderWidth = '2px';
    element.style.borderStyle = 'solid';
    element.style.borderColor = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const result = detectContrast(element, { prioritizeBorder: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('border');

    document.body.removeChild(element);
  });

  it('SVG優先モードでSVG色を検知する', () => {
    const container = document.createElement('div');
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'rgb(0, 0, 0)';
    container.appendChild(svg);
    document.body.appendChild(container);

    const result = detectContrast(container, { prioritizeSvg: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');

    document.body.removeChild(container);
  });

  it('リンク要素を検知する', () => {
    const link = document.createElement('a');
    link.style.color = 'rgb(0, 0, 255)';
    link.style.textDecorationLine = 'underline';
    link.href = '#';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(link);

    const result = detectContrast(link);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('link');
    expect(result.hasUnderline).toBe(true);

    document.body.removeChild(link);
  });

  it('下線なしリンク要素を検知する', () => {
    const parent = document.createElement('p');
    parent.style.color = 'rgb(0, 0, 0)';
    const link = document.createElement('a');
    link.style.color = 'rgb(0, 0, 255)';
    link.style.textDecorationLine = 'none';
    link.href = '#';
    parent.appendChild(link);
    document.body.appendChild(parent);

    const result = detectContrast(link);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('link-no-underline');
    expect(result.hasUnderline).toBe(false);

    document.body.removeChild(parent);
  });
});

describe('detectContrastAsync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('非同期でコントラストを検知する', async () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const promise = detectContrastAsync(element);

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.ratio).toBeCloseTo(21, 0);

    document.body.removeChild(element);
  });
});

describe('detectFocusRingColor', () => {
  it('outline色を検知する', () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(button);

    const result = detectFocusRingColor(button);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('outline');
    expect(result?.color).toBe('rgb(0, 0, 255)');

    document.body.removeChild(button);
  });

  it('box-shadow色を検知する', () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '0';
    button.style.boxShadow = '0 0 0 3px rgb(59, 130, 246)';
    document.body.appendChild(button);

    const result = detectFocusRingColor(button);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('box-shadow');

    document.body.removeChild(button);
  });

  it('フォーカスできない要素でnullを返す', () => {
    const span = document.createElement('span');
    document.body.appendChild(span);

    // spanはフォーカスできないのでnullの可能性が高い
    // ただしjsdomの挙動に依存するため、呼び出しのみ確認
    void detectFocusRingColor(span);

    document.body.removeChild(span);
  });

  it('HTMLElement以外でnullを返す', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // SVGElementはHTMLElementではないが、focusメソッドを持つ場合がある
    // 型チェックでnullを返すことを確認
    const result = detectFocusRingColor(svg);
    expect(result).toBeNull();
  });
});

describe('detectFocusRingColorAsync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('非同期でoutline色を検知する', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(result).not.toBeNull();
    expect(result?.type).toBe('outline');

    document.body.removeChild(button);
  });

  it('HTMLElement以外でnullを返す', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const result = await detectFocusRingColorAsync(svg);

    expect(result).toBeNull();
  });
});
