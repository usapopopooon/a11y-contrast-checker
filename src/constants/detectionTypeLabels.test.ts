import { describe, it, expect } from 'vitest';
import { detectionTypeLabels } from './detectionTypeLabels';

describe('detectionTypeLabels', () => {
  it('textに対してテキストを返す', () => {
    expect(detectionTypeLabels['text']).toBe('テキスト');
  });

  it('borderに対してボーダーを返す', () => {
    expect(detectionTypeLabels['border']).toBe('ボーダー');
  });

  it('svgに対してSVGを返す', () => {
    expect(detectionTypeLabels['svg']).toBe('SVG');
  });

  it('placeholderに対してプレースホルダーを返す', () => {
    expect(detectionTypeLabels['placeholder']).toBe('プレースホルダー');
  });

  it('focus-ringに対してフォーカスリングを返す', () => {
    expect(detectionTypeLabels['focus-ring']).toBe('フォーカスリング');
  });

  it('gradientに対してグラデーションを返す', () => {
    expect(detectionTypeLabels['gradient']).toBe('グラデーション');
  });

  it('linkに対してリンクを返す', () => {
    expect(detectionTypeLabels['link']).toBe('リンク');
  });

  it('link-no-underlineに対してリンク(下線なし)を返す', () => {
    expect(detectionTypeLabels['link-no-underline']).toBe('リンク(下線なし)');
  });

  it('unknownに対して不明を返す', () => {
    expect(detectionTypeLabels['unknown']).toBe('不明');
  });

  it('全ての検知タイプに対応するラベルが定義されている', () => {
    const expectedTypes = [
      'text',
      'border',
      'svg',
      'placeholder',
      'focus-ring',
      'gradient',
      'link',
      'link-no-underline',
      'unknown',
    ];

    for (const type of expectedTypes) {
      expect(detectionTypeLabels[type]).toBeDefined();
      expect(typeof detectionTypeLabels[type]).toBe('string');
      expect(detectionTypeLabels[type].length).toBeGreaterThan(0);
    }
  });

  it('9種類のラベルが定義されている', () => {
    expect(Object.keys(detectionTypeLabels).length).toBe(9);
  });
});
