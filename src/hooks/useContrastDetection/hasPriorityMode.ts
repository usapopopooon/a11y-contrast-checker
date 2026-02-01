import type { DetectionOptions } from '@/lib/contrast/index';
import { PRIORITY_TYPE_MAPPINGS } from './constants';

/**
 * 優先モードが設定されているかチェック（純粋関数）
 */
export const hasPriorityMode = (options: DetectionOptions): boolean =>
  PRIORITY_TYPE_MAPPINGS.some(({ option }) => options[option]);
