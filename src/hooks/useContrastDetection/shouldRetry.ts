import type { DetectionResult, DetectionOptions } from '@/lib/contrast/index';
import type { RetryConfig } from './types';
import { hasPriorityMode } from './hasPriorityMode';
import { isValidRatio } from './isValidRatio';
import { matchesExpectedType } from './matchesExpectedType';

/**
 * リトライが必要かどうか判定（純粋関数）
 */
export const shouldRetry = (
  result: DetectionResult,
  options: DetectionOptions,
  retryCount: number,
  config: RetryConfig
): boolean => {
  if (retryCount >= config.maxRetries) return false;
  if (!hasPriorityMode(options)) return false;
  if (!isValidRatio(result.ratio)) return true;
  return !matchesExpectedType(result, options);
};
