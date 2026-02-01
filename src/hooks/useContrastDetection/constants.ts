import type { RetryConfig, PriorityTypeMapping } from './types';

/** デフォルトのリトライ設定 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = Object.freeze({
  maxRetries: 3,
  initialDelay: 100,
  delayMultiplier: 150,
});

/** 優先モードと期待するタイプのマッピング */
export const PRIORITY_TYPE_MAPPINGS: PriorityTypeMapping = Object.freeze([
  { option: 'detectFocusRing', expectedType: 'focus-ring' },
  { option: 'prioritizePlaceholder', expectedType: 'placeholder' },
  { option: 'prioritizeBorder', expectedType: 'border' },
  { option: 'prioritizeSvg', expectedType: 'svg' },
]);
