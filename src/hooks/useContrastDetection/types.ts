import type { DetectionOptions, DetectionResult } from '@/lib/contrast/index';

/** リトライ設定（イミュータブル） */
export interface RetryConfig {
  readonly maxRetries: number;
  readonly initialDelay: number;
  readonly delayMultiplier: number;
}

/** 優先モードと期待するタイプのマッピング */
export type PriorityTypeMapping = ReadonlyArray<{
  readonly option: keyof DetectionOptions;
  readonly expectedType: DetectionResult['type'];
}>;
