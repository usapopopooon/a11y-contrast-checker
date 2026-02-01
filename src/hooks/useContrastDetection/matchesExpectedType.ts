import type { DetectionResult, DetectionOptions } from '@/lib/contrast/index';
import { getExpectedType } from './getExpectedType';

/**
 * 検知結果が期待と一致しているかチェック（純粋関数）
 */
export const matchesExpectedType = (
  result: DetectionResult,
  options: DetectionOptions
): boolean => {
  const expectedType = getExpectedType(options);
  return expectedType === null || result.type === expectedType;
};
