import type { DetectionResult } from '@/lib/contrast/index';
import { getJudgmentState } from './getJudgmentState';
import { stateToClass } from './stateToClass';
import { parseRequiredRatio } from './parseRequiredRatio';
import { meetsRequirement } from './meetsRequirement';
import { BORDER_CLASSES } from './constants';

// 型エクスポート
export type { JudgmentState, BorderClassMapping } from './types';

// 定数エクスポート
export { BORDER_CLASSES } from './constants';

// ヘルパー関数エクスポート
export { parseRequiredRatio } from './parseRequiredRatio';
export { meetsRequirement } from './meetsRequirement';
export { getJudgmentState } from './getJudgmentState';
export { stateToClass } from './stateToClass';

/**
 * 検知結果に基づくカード枠線クラスを取得（純粋関数）
 *
 * @param detection - 検知結果（null可）
 * @param requiredRatio - 基準比率（文字列、"免除"などの場合も考慮）
 * @param expectedOk - 期待する結果（OK=true, NG=false）
 * @returns CSSクラス文字列
 */
export const getCardBorderClass = (
  detection: DetectionResult | null,
  requiredRatio: string,
  expectedOk: boolean
): string =>
  stateToClass(getJudgmentState(detection, requiredRatio, expectedOk));

// テスト用エクスポート（後方互換性）
export const _internal = {
  parseRequiredRatio,
  meetsRequirement,
  getJudgmentState,
  stateToClass,
  BORDER_CLASSES,
} as const;
