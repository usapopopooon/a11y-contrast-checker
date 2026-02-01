import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StyleCache, globalStyleCache, CACHE_TTL } from './StyleCache';

// ============================================================
// テストヘルパー
// ============================================================

const createMockElement = (): HTMLDivElement => {
  const element = document.createElement('div');
  element.style.color = 'rgb(0, 0, 0)';
  element.style.backgroundColor = 'rgb(255, 255, 255)';
  element.style.borderColor = 'rgb(128, 128, 128)';
  element.style.borderWidth = '1px';
  element.style.borderStyle = 'solid';
  element.style.opacity = '1';
  document.body.appendChild(element);
  return element;
};

const cleanupElement = (element: HTMLElement): void => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

// ============================================================
// StyleCache クラス
// ============================================================

describe('StyleCache', () => {
  let cache: StyleCache;
  let element: HTMLDivElement;

  beforeEach(() => {
    cache = new StyleCache();
    element = createMockElement();
  });

  afterEach(() => {
    cleanupElement(element);
  });

  describe('getStyle', () => {
    it('要素のCSSStyleDeclarationを返す', () => {
      const style = cache.getStyle(element);
      expect(style).toBeInstanceOf(CSSStyleDeclaration);
    });

    it('同じ要素に対してキャッシュを使用する', () => {
      const style1 = cache.getStyle(element);
      const style2 = cache.getStyle(element);
      expect(style1).toBe(style2);
    });

    it('異なる要素に対して異なるスタイルを返す', () => {
      const element2 = createMockElement();
      element2.style.color = 'rgb(255, 0, 0)';

      const style1 = cache.getStyle(element);
      const style2 = cache.getStyle(element2);

      expect(style1.color).toBe('rgb(0, 0, 0)');
      expect(style2.color).toBe('rgb(255, 0, 0)');

      cleanupElement(element2);
    });

    it('疑似要素を指定した場合、キャッシュを使用しない', () => {
      const style1 = cache.getStyle(element, '::before');
      const style2 = cache.getStyle(element, '::before');
      // 毎回新しいスタイルを取得（参照が異なる可能性がある）
      expect(style1).toBeInstanceOf(CSSStyleDeclaration);
      expect(style2).toBeInstanceOf(CSSStyleDeclaration);
    });
  });

  describe('getProperty', () => {
    it('特定のプロパティ値を返す', () => {
      expect(cache.getProperty(element, 'color')).toBe('rgb(0, 0, 0)');
      expect(cache.getProperty(element, 'backgroundColor')).toBe(
        'rgb(255, 255, 255)'
      );
    });

    it('キャッシュを使用してプロパティを返す', () => {
      // 最初の呼び出しでキャッシュ
      cache.getStyle(element);

      // プロパティ取得時もキャッシュを使用
      const color = cache.getProperty(element, 'color');
      expect(color).toBe('rgb(0, 0, 0)');

      const stats = cache.getStats();
      expect(stats.hits).toBeGreaterThan(0);
    });
  });

  describe('invalidate', () => {
    it('指定した要素のキャッシュを無効化する', () => {
      // キャッシュを作成
      cache.getStyle(element);

      // 無効化
      cache.invalidate(element);

      // 次回は新しいスタイルを取得
      const statsBefore = cache.getStats();
      cache.getStyle(element);
      const statsAfter = cache.getStats();

      expect(statsAfter.misses).toBe(statsBefore.misses + 1);
    });
  });

  describe('getStats', () => {
    it('初期状態でhits=0, misses=0', () => {
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
    });

    it('キャッシュミス時にmissesが増加', () => {
      cache.getStyle(element);
      const stats = cache.getStats();
      expect(stats.misses).toBe(1);
    });

    it('キャッシュヒット時にhitsが増加', () => {
      cache.getStyle(element);
      cache.getStyle(element);
      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('hitRateを正しく計算する', () => {
      cache.getStyle(element);
      cache.getStyle(element);
      cache.getStyle(element);
      const stats = cache.getStats();
      // 1 miss + 2 hits = 2/3 hit rate
      expect(stats.hitRate).toBeCloseTo(2 / 3, 2);
    });

    it('イミュータブルなオブジェクトを返す', () => {
      const stats = cache.getStats();
      expect(Object.isFrozen(stats)).toBe(true);
    });
  });

  describe('resetStats', () => {
    it('統計をリセットする', () => {
      cache.getStyle(element);
      cache.getStyle(element);

      cache.resetStats();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('TTL（有効期限）', () => {
    it('TTL内ではキャッシュを使用する', () => {
      cache.getStyle(element);
      cache.getStyle(element);

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
    });

    it('TTL後はキャッシュが無効になる', async () => {
      vi.useFakeTimers();

      cache.getStyle(element);

      // TTLを超える時間を進める
      vi.advanceTimersByTime(CACHE_TTL + 10);

      cache.getStyle(element);

      const stats = cache.getStats();
      // 両方ミスになるはず
      expect(stats.misses).toBe(2);

      vi.useRealTimers();
    });
  });
});

// ============================================================
// globalStyleCache
// ============================================================

describe('globalStyleCache', () => {
  it('StyleCacheのインスタンスである', () => {
    expect(globalStyleCache).toBeInstanceOf(StyleCache);
  });

  it('グローバルに利用可能', () => {
    const element = createMockElement();
    const style = globalStyleCache.getStyle(element);
    expect(style).toBeInstanceOf(CSSStyleDeclaration);
    cleanupElement(element);
  });
});

// ============================================================
// 定数
// ============================================================

describe('CACHE_TTL', () => {
  it('100msに設定されている', () => {
    expect(CACHE_TTL).toBe(100);
  });
});
