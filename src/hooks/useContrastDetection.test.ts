import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContrastDetection, _internal } from './useContrastDetection/index';
import type { DetectionResult, DetectionOptions } from '@/lib/contrast/index';
import * as contrastModule from '@/lib/contrast/index';

const {
  getExpectedType,
  hasPriorityMode,
  isValidRatio,
  matchesExpectedType,
  shouldRetry,
  calcRetryDelay,
  DEFAULT_RETRY_CONFIG,
} = _internal;

// ============================================================
// テストヘルパー
// ============================================================

const createDetectionResult = (
  overrides: Partial<DetectionResult> = {}
): DetectionResult => ({
  detected: true,
  ratio: 4.5,
  color: 'rgb(0, 0, 0)',
  bgColor: 'rgb(255, 255, 255)',
  type: 'text',
  ...overrides,
});

// ============================================================
// getExpectedType
// ============================================================

describe('getExpectedType', () => {
  it('detectFocusRingがtrueの場合、focus-ringを返す', () => {
    expect(getExpectedType({ detectFocusRing: true })).toBe('focus-ring');
  });

  it('prioritizePlaceholderがtrueの場合、placeholderを返す', () => {
    expect(getExpectedType({ prioritizePlaceholder: true })).toBe(
      'placeholder'
    );
  });

  it('prioritizeBorderがtrueの場合、borderを返す', () => {
    expect(getExpectedType({ prioritizeBorder: true })).toBe('border');
  });

  it('prioritizeSvgがtrueの場合、svgを返す', () => {
    expect(getExpectedType({ prioritizeSvg: true })).toBe('svg');
  });

  it('優先モードがない場合、nullを返す', () => {
    expect(getExpectedType({})).toBeNull();
  });

  it('複数の優先モードがある場合、最初にマッチしたものを返す', () => {
    expect(
      getExpectedType({
        detectFocusRing: true,
        prioritizePlaceholder: true,
      })
    ).toBe('focus-ring');
  });
});

// ============================================================
// hasPriorityMode
// ============================================================

describe('hasPriorityMode', () => {
  it('detectFocusRingがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ detectFocusRing: true })).toBe(true);
  });

  it('prioritizePlaceholderがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ prioritizePlaceholder: true })).toBe(true);
  });

  it('prioritizeBorderがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ prioritizeBorder: true })).toBe(true);
  });

  it('prioritizeSvgがtrueの場合、trueを返す', () => {
    expect(hasPriorityMode({ prioritizeSvg: true })).toBe(true);
  });

  it('優先モードがない場合、falseを返す', () => {
    expect(hasPriorityMode({})).toBe(false);
  });

  it('全てfalseの場合、falseを返す', () => {
    expect(
      hasPriorityMode({
        detectFocusRing: false,
        prioritizePlaceholder: false,
        prioritizeBorder: false,
        prioritizeSvg: false,
      })
    ).toBe(false);
  });
});

// ============================================================
// isValidRatio
// ============================================================

describe('isValidRatio', () => {
  it('1.05より大きい場合、trueを返す', () => {
    expect(isValidRatio(1.06)).toBe(true);
    expect(isValidRatio(4.5)).toBe(true);
    expect(isValidRatio(21)).toBe(true);
  });

  it('1.05以下の場合、falseを返す', () => {
    expect(isValidRatio(1.05)).toBe(false);
    expect(isValidRatio(1.0)).toBe(false);
    expect(isValidRatio(0)).toBe(false);
  });

  it('境界値1.051でtrueを返す', () => {
    expect(isValidRatio(1.051)).toBe(true);
  });
});

// ============================================================
// matchesExpectedType
// ============================================================

describe('matchesExpectedType', () => {
  it('期待するタイプがない場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'text' });
    expect(matchesExpectedType(result, {})).toBe(true);
  });

  it('タイプが一致する場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'focus-ring' });
    expect(matchesExpectedType(result, { detectFocusRing: true })).toBe(true);
  });

  it('タイプが一致しない場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'text' });
    expect(matchesExpectedType(result, { detectFocusRing: true })).toBe(false);
  });

  it('placeholder優先でplaceholderタイプの場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'placeholder' });
    expect(matchesExpectedType(result, { prioritizePlaceholder: true })).toBe(
      true
    );
  });

  it('border優先でborderタイプの場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'border' });
    expect(matchesExpectedType(result, { prioritizeBorder: true })).toBe(true);
  });

  it('svg優先でsvgタイプの場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'svg' });
    expect(matchesExpectedType(result, { prioritizeSvg: true })).toBe(true);
  });
});

// ============================================================
// shouldRetry
// ============================================================

describe('shouldRetry', () => {
  const config = DEFAULT_RETRY_CONFIG;

  it('リトライ回数が上限に達した場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'text', ratio: 1.0 });
    expect(shouldRetry(result, { detectFocusRing: true }, 3, config)).toBe(
      false
    );
  });

  it('優先モードがない場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'text', ratio: 1.0 });
    expect(shouldRetry(result, {}, 0, config)).toBe(false);
  });

  it('比率が無効な場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'focus-ring', ratio: 1.0 });
    expect(shouldRetry(result, { detectFocusRing: true }, 0, config)).toBe(
      true
    );
  });

  it('タイプが一致しない場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'text', ratio: 4.5 });
    expect(shouldRetry(result, { detectFocusRing: true }, 0, config)).toBe(
      true
    );
  });

  it('タイプが一致し比率も有効な場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'focus-ring', ratio: 4.5 });
    expect(shouldRetry(result, { detectFocusRing: true }, 0, config)).toBe(
      false
    );
  });

  it('リトライ回数が上限未満でもタイプ一致ならfalseを返す', () => {
    const result = createDetectionResult({ type: 'border', ratio: 3.0 });
    expect(shouldRetry(result, { prioritizeBorder: true }, 2, config)).toBe(
      false
    );
  });
});

// ============================================================
// calcRetryDelay
// ============================================================

describe('calcRetryDelay', () => {
  const config = DEFAULT_RETRY_CONFIG;

  it('リトライ回数0の場合、delayMultiplier * 1を返す', () => {
    expect(calcRetryDelay(0, config)).toBe(150);
  });

  it('リトライ回数1の場合、delayMultiplier * 2を返す', () => {
    expect(calcRetryDelay(1, config)).toBe(300);
  });

  it('リトライ回数2の場合、delayMultiplier * 3を返す', () => {
    expect(calcRetryDelay(2, config)).toBe(450);
  });

  it('カスタム設定で正しく計算される', () => {
    const customConfig = { ...config, delayMultiplier: 100 };
    expect(calcRetryDelay(0, customConfig)).toBe(100);
    expect(calcRetryDelay(1, customConfig)).toBe(200);
  });
});

// ============================================================
// DEFAULT_RETRY_CONFIG
// ============================================================

describe('DEFAULT_RETRY_CONFIG', () => {
  it('デフォルト値が正しく設定されている', () => {
    expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(3);
    expect(DEFAULT_RETRY_CONFIG.initialDelay).toBe(100);
    expect(DEFAULT_RETRY_CONFIG.delayMultiplier).toBe(150);
  });

  it('イミュータブルである（凍結されている）', () => {
    expect(Object.isFrozen(DEFAULT_RETRY_CONFIG)).toBe(true);
  });
});

// ============================================================
// useContrastDetection フック（統合テスト）
// ============================================================

// モックをモジュールレベルで定義
vi.mock('@/lib/contrast', async (importOriginal) => {
  const actual = await importOriginal<typeof contrastModule>();
  return {
    ...actual,
    detectContrastAsync: vi.fn(),
  };
});

describe('useContrastDetection hook', () => {
  const mockDetectContrastAsync = vi.mocked(contrastModule.detectContrastAsync);

  beforeEach(() => {
    vi.useFakeTimers();
    mockDetectContrastAsync.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockRef = (
    element: HTMLElement | null = document.createElement('div')
  ) => ({
    current: element,
  });

  const fastConfig = Object.freeze({
    maxRetries: 3,
    initialDelay: 10,
    delayMultiplier: 10,
  });

  it('初期状態でnullを返す', () => {
    mockDetectContrastAsync.mockResolvedValue(createDetectionResult());
    const ref = createMockRef();

    const { result } = renderHook(() =>
      useContrastDetection(ref, {}, fastConfig)
    );

    expect(result.current).toBeNull();
  });

  it('検知結果を返す', async () => {
    const expectedResult = createDetectionResult({ ratio: 5.0, type: 'text' });
    mockDetectContrastAsync.mockResolvedValue(expectedResult);
    const ref = createMockRef();

    const { result } = renderHook(() =>
      useContrastDetection(ref, {}, fastConfig)
    );

    // 初期遅延を進める（advanceTimersByTimeAsyncでPromise解決を待つ）
    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.initialDelay + 50);
    });

    expect(result.current).toEqual(expectedResult);
  });

  it('refがnullの場合、検知を実行しない', async () => {
    const ref = createMockRef(null);

    renderHook(() => useContrastDetection(ref, {}, fastConfig));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.initialDelay + 50);
    });

    expect(mockDetectContrastAsync).not.toHaveBeenCalled();
  });

  it('優先モードで期待タイプが検知されるまでリトライする', async () => {
    const textResult = createDetectionResult({ ratio: 4.5, type: 'text' });
    const focusRingResult = createDetectionResult({
      ratio: 4.5,
      type: 'focus-ring',
    });

    // 最初はtextを返し、2回目でfocus-ringを返す
    mockDetectContrastAsync
      .mockResolvedValueOnce(textResult)
      .mockResolvedValueOnce(focusRingResult);

    const ref = createMockRef();
    const options: DetectionOptions = { detectFocusRing: true };

    const { result } = renderHook(() =>
      useContrastDetection(ref, options, fastConfig)
    );

    // 初期遅延 + リトライ遅延を十分に進める
    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.initialDelay + 50);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.delayMultiplier + 50);
    });

    expect(result.current?.type).toBe('focus-ring');
    expect(mockDetectContrastAsync).toHaveBeenCalledTimes(2);
  });

  it('優先モードで最大リトライ回数に達すると最後の結果を返す', async () => {
    const textResult = createDetectionResult({ ratio: 4.5, type: 'text' });

    // 常にtextを返す
    mockDetectContrastAsync.mockResolvedValue(textResult);

    const ref = createMockRef();
    const options: DetectionOptions = { detectFocusRing: true };

    const { result } = renderHook(() =>
      useContrastDetection(ref, options, fastConfig)
    );

    // 全リトライを完了させるのに十分な時間を進める
    const totalTime =
      fastConfig.initialDelay +
      fastConfig.delayMultiplier * (1 + 2 + 3) + // 各リトライの遅延
      200; // バッファ

    await act(async () => {
      await vi.advanceTimersByTimeAsync(totalTime);
    });

    expect(result.current).not.toBeNull();
    // maxRetries + 1回（最初の1回 + 3回リトライ）
    expect(mockDetectContrastAsync).toHaveBeenCalledTimes(
      fastConfig.maxRetries + 1
    );
    expect(result.current?.type).toBe('text');
  });

  it('コンポーネントがアンマウントされるとキャンセルされる', async () => {
    const expectedResult = createDetectionResult();
    mockDetectContrastAsync.mockResolvedValue(expectedResult);
    const ref = createMockRef();

    const { result, unmount } = renderHook(() =>
      useContrastDetection(ref, {}, fastConfig)
    );

    // アンマウント
    unmount();

    // タイマーを進める
    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.initialDelay + 50);
    });

    // アンマウント後は結果が更新されない
    expect(result.current).toBeNull();
  });

  it('無効な比率の場合リトライする', async () => {
    const invalidResult = createDetectionResult({
      ratio: 1.0,
      type: 'focus-ring',
    });
    const validResult = createDetectionResult({
      ratio: 4.5,
      type: 'focus-ring',
    });

    mockDetectContrastAsync
      .mockResolvedValueOnce(invalidResult)
      .mockResolvedValueOnce(validResult);

    const ref = createMockRef();
    const options: DetectionOptions = { detectFocusRing: true };

    const { result } = renderHook(() =>
      useContrastDetection(ref, options, fastConfig)
    );

    // 初期遅延
    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.initialDelay + 50);
    });

    // リトライ遅延
    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.delayMultiplier + 50);
    });

    expect(result.current?.ratio).toBe(4.5);
  });

  it('優先モードなしでは即座に結果を返す', async () => {
    const expectedResult = createDetectionResult({ ratio: 1.0, type: 'text' });
    mockDetectContrastAsync.mockResolvedValue(expectedResult);

    const ref = createMockRef();

    const { result } = renderHook(() =>
      useContrastDetection(ref, {}, fastConfig)
    );

    // 初期遅延のみ
    await act(async () => {
      await vi.advanceTimersByTimeAsync(fastConfig.initialDelay + 50);
    });

    expect(result.current).toEqual(expectedResult);

    // リトライなし
    expect(mockDetectContrastAsync).toHaveBeenCalledTimes(1);
  });
});
