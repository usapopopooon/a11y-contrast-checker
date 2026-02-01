import type { RetryConfig } from './types';

/**
 * 次のリトライまでの遅延を計算（純粋関数）
 */
export const calcRetryDelay = (
  retryCount: number,
  config: RetryConfig
): number => config.delayMultiplier * (retryCount + 1);
