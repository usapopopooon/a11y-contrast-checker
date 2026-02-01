import type { DetectionResult } from '@/lib/contrast/index';
import type { JudgmentState } from './types';
import { parseRequiredRatio } from './parseRequiredRatio';
import { meetsRequirement } from './meetsRequirement';

/**
 * 判定状態を取得（純粋関数）
 */
export const getJudgmentState = (
  detection: DetectionResult | null,
  requiredRatio: string,
  expectedOk: boolean
): JudgmentState => {
  // 検知なし
  if (!detection) return 'no-detection';

  // 基準値パース
  const required = parseRequiredRatio(requiredRatio);

  // 免除（基準値が数値でない）
  if (required === null) return 'exempt';

  // 期待と検知結果の一致判定
  const detectedOk = meetsRequirement(detection.ratio, required);
  return expectedOk === detectedOk ? 'match' : 'mismatch';
};
