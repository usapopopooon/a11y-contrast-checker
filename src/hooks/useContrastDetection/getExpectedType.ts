import type { DetectionOptions, DetectionResult } from '@/lib/contrast/index';
import { PRIORITY_TYPE_MAPPINGS } from './constants';

/**
 * オプションから期待されるタイプを取得（純粋関数）
 */
export const getExpectedType = (
  options: DetectionOptions
): DetectionResult['type'] | null =>
  PRIORITY_TYPE_MAPPINGS.find(({ option }) => options[option])?.expectedType ??
  null;
