/** 判定結果の状態 */
export type JudgmentState = 'no-detection' | 'exempt' | 'match' | 'mismatch';

/** 状態とCSSクラスのマッピング */
export type BorderClassMapping = Readonly<Record<JudgmentState, string>>;
