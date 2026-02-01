import { useEffect, useState, useRef } from 'react';
import {
  detectContrastAsync,
  type DetectionResult,
  type DetectionOptions,
} from '@/lib/contrast/index';
import type { RetryConfig } from './types';
import { DEFAULT_RETRY_CONFIG } from './constants';
import { shouldRetry } from './shouldRetry';
import { calcRetryDelay } from './calcRetryDelay';

// ============================================================
// 型・定数・ヘルパー関数のエクスポート
// ============================================================

export type { RetryConfig, PriorityTypeMapping } from './types';
export { DEFAULT_RETRY_CONFIG, PRIORITY_TYPE_MAPPINGS } from './constants';
export { getExpectedType } from './getExpectedType';
export { hasPriorityMode } from './hasPriorityMode';
export { isValidRatio } from './isValidRatio';
export { matchesExpectedType } from './matchesExpectedType';
export { shouldRetry } from './shouldRetry';
export { calcRetryDelay } from './calcRetryDelay';

// ============================================================
// フック
// ============================================================

/**
 * コントラスト検知フック（レンダリング後に実行）
 *
 * @description
 * 初回ロード時のCSS適用タイミング問題に対応するため、
 * 優先モード指定時は期待するタイプが検知されるまでリトライする。
 * 効率のためrefを使用してリトライ回数を追跡（再レンダリング回避）。
 */
export function useContrastDetection(
  ref: React.RefObject<HTMLElement | null>,
  options: DetectionOptions = {},
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): DetectionResult | null {
  const [result, setResult] = useState<DetectionResult | null>(null);
  // 効率化: リトライ回数はレンダリングに影響しないためrefで管理
  const retryCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const detect = async (): Promise<void> => {
      const element = ref.current;
      if (!element || cancelled) return;

      const detectionResult = await detectContrastAsync(element, options);
      if (cancelled) return;

      const needsRetry = shouldRetry(
        detectionResult,
        options,
        retryCountRef.current,
        config
      );

      if (needsRetry) {
        const delay = calcRetryDelay(retryCountRef.current, config);
        retryCountRef.current += 1;
        setTimeout(detect, delay);
      } else {
        setResult(detectionResult);
      }
    };

    // リトライカウントをリセット
    retryCountRef.current = 0;

    // 初回遅延後に検知開始
    const timer = setTimeout(detect, config.initialDelay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ref, options, config]);

  return result;
}

// ============================================================
// テスト用エクスポート（後方互換性）
// ============================================================

import { getExpectedType } from './getExpectedType';
import { hasPriorityMode } from './hasPriorityMode';
import { isValidRatio } from './isValidRatio';
import { matchesExpectedType } from './matchesExpectedType';

export const _internal = {
  getExpectedType,
  hasPriorityMode,
  isValidRatio,
  matchesExpectedType,
  shouldRetry,
  calcRetryDelay,
  DEFAULT_RETRY_CONFIG,
} as const;
