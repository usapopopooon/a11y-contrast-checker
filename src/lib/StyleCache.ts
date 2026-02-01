/**
 * StyleCache - 計算済みスタイルをキャッシュするクラス
 *
 * DOM操作（getComputedStyle）は高コストなため、
 * 同一要素への複数回アクセスをキャッシュで効率化する。
 * クラスを使用する理由: ミュータブルなキャッシュ状態の効率的な管理
 */

// ============================================================
// 型定義
// ============================================================

/** キャッシュされるスタイルプロパティ */
interface CachedStyleProperties {
  readonly color: string;
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly borderWidth: string;
  readonly borderStyle: string;
  readonly outlineColor: string;
  readonly outlineWidth: string;
  readonly boxShadow: string;
  readonly opacity: string;
  readonly fill: string;
  readonly stroke: string;
}

/** キャッシュエントリ */
interface CacheEntry {
  readonly style: CSSStyleDeclaration;
  readonly properties: CachedStyleProperties;
  readonly timestamp: number;
}

// ============================================================
// 定数
// ============================================================

/** キャッシュの有効期限（ms） */
const CACHE_TTL = 100;

/** キャッシュするプロパティ名リスト */
const CACHED_PROPERTIES: ReadonlyArray<keyof CachedStyleProperties> =
  Object.freeze([
    'color',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderStyle',
    'outlineColor',
    'outlineWidth',
    'boxShadow',
    'opacity',
    'fill',
    'stroke',
  ]);

// ============================================================
// 純粋関数（ヘルパー）
// ============================================================

/**
 * CSSStyleDeclarationから必要なプロパティを抽出（純粋関数）
 */
const extractProperties = (
  style: CSSStyleDeclaration
): CachedStyleProperties => ({
  color: style.color,
  backgroundColor: style.backgroundColor,
  borderColor: style.borderColor,
  borderWidth: style.borderWidth,
  borderStyle: style.borderStyle,
  outlineColor: style.outlineColor,
  outlineWidth: style.outlineWidth,
  boxShadow: style.boxShadow,
  opacity: style.opacity,
  fill: style.fill,
  stroke: style.stroke,
});

/**
 * キャッシュエントリが有効かチェック（純粋関数）
 */
const isValidEntry = (entry: CacheEntry | undefined, now: number): boolean =>
  entry !== undefined && now - entry.timestamp < CACHE_TTL;

// ============================================================
// StyleCacheクラス
// ============================================================

/**
 * 計算済みスタイルのキャッシュ
 *
 * @example
 * ```ts
 * const cache = new StyleCache();
 * const style = cache.getStyle(element);
 * const color = cache.getProperty(element, 'color');
 * cache.clear(); // 使用後にクリア
 * ```
 */
export class StyleCache {
  private readonly cache = new WeakMap<Element, CacheEntry>();
  private hitCount = 0;
  private missCount = 0;

  /**
   * 要素の計算済みスタイルを取得（キャッシュあり）
   */
  getStyle(element: Element, pseudoElement?: string): CSSStyleDeclaration {
    // 疑似要素はキャッシュしない（複数種類があるため）
    if (pseudoElement) {
      return getComputedStyle(element, pseudoElement);
    }

    const now = Date.now();
    const cached = this.cache.get(element);

    if (isValidEntry(cached, now)) {
      this.hitCount++;
      return cached!.style;
    }

    this.missCount++;
    const style = getComputedStyle(element);
    const entry: CacheEntry = {
      style,
      properties: extractProperties(style),
      timestamp: now,
    };
    this.cache.set(element, entry);

    return style;
  }

  /**
   * 特定のプロパティ値を取得（キャッシュあり）
   */
  getProperty<K extends keyof CachedStyleProperties>(
    element: Element,
    property: K
  ): string {
    const now = Date.now();
    const cached = this.cache.get(element);

    if (isValidEntry(cached, now)) {
      this.hitCount++;
      return cached!.properties[property];
    }

    // キャッシュミス時はスタイルを取得してキャッシュ
    this.getStyle(element);
    const newCached = this.cache.get(element);
    return newCached?.properties[property] ?? '';
  }

  /**
   * 特定の要素のキャッシュを無効化
   */
  invalidate(element: Element): void {
    this.cache.delete(element);
  }

  /**
   * キャッシュ統計を取得
   */
  getStats(): {
    readonly hits: number;
    readonly misses: number;
    readonly hitRate: number;
  } {
    const total = this.hitCount + this.missCount;
    return Object.freeze({
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: total > 0 ? this.hitCount / total : 0,
    });
  }

  /**
   * 統計をリセット
   */
  resetStats(): void {
    this.hitCount = 0;
    this.missCount = 0;
  }
}

// ============================================================
// シングルトンインスタンス
// ============================================================

/**
 * グローバルなスタイルキャッシュインスタンス
 * 同一レンダリングサイクル内での再利用を想定
 */
export const globalStyleCache = new StyleCache();

// ============================================================
// エクスポート
// ============================================================

export { CACHED_PROPERTIES, CACHE_TTL };
export type { CachedStyleProperties, CacheEntry };
