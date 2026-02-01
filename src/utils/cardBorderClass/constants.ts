import type { BorderClassMapping } from './types';

/** 状態に対応するCSSクラス */
export const BORDER_CLASSES: BorderClassMapping = Object.freeze({
  'no-detection': '',
  exempt: 'border-slate-200',
  match: 'border-green-400',
  mismatch: 'border-red-400',
});
