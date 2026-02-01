import type { JudgmentState } from './types';
import { BORDER_CLASSES } from './constants';

/**
 * 判定状態からCSSクラスを取得（純粋関数）
 */
export const stateToClass = (state: JudgmentState): string =>
  BORDER_CLASSES[state];
