import { describe, it, expect } from 'vitest';
import { getCardBorderClass, _internal } from './cardBorderClass/index';
import type { DetectionResult } from '@/lib/contrast/index';

const {
  parseRequiredRatio,
  meetsRequirement,
  getJudgmentState,
  stateToClass,
  BORDER_CLASSES,
} = _internal;

// ============================================================
// テストヘルパー
// ============================================================

const createDetectionResult = (
  overrides: Partial<DetectionResult> = {}
): DetectionResult => ({
  detected: true,
  ratio: 4.5,
  color: 'rgb(0, 0, 0)',
  bgColor: 'rgb(255, 255, 255)',
  type: 'text',
  ...overrides,
});

// ============================================================
// parseRequiredRatio
// ============================================================

describe('parseRequiredRatio', () => {
  it('有効な数値文字列をパースする', () => {
    expect(parseRequiredRatio('4.5')).toBe(4.5);
    expect(parseRequiredRatio('3.0')).toBe(3.0);
    expect(parseRequiredRatio('21')).toBe(21);
  });

  it('小数点を含む文字列をパースする', () => {
    expect(parseRequiredRatio('4.51')).toBe(4.51);
    expect(parseRequiredRatio('0.5')).toBe(0.5);
  });

  it('無効な文字列の場合nullを返す', () => {
    expect(parseRequiredRatio('免除')).toBeNull();
    expect(parseRequiredRatio('N/A')).toBeNull();
    expect(parseRequiredRatio('')).toBeNull();
    expect(parseRequiredRatio('abc')).toBeNull();
  });

  it('数字で始まる無効な文字列を正しく処理する', () => {
    // parseFloatの挙動: 先頭が数字なら可能な限りパースする
    expect(parseRequiredRatio('4.5:1')).toBe(4.5);
  });
});

// ============================================================
// meetsRequirement
// ============================================================

describe('meetsRequirement', () => {
  it('比率が基準以上の場合trueを返す', () => {
    expect(meetsRequirement(4.5, 4.5)).toBe(true);
    expect(meetsRequirement(5.0, 4.5)).toBe(true);
    expect(meetsRequirement(21, 3.0)).toBe(true);
  });

  it('比率が基準未満の場合falseを返す', () => {
    expect(meetsRequirement(4.4, 4.5)).toBe(false);
    expect(meetsRequirement(2.9, 3.0)).toBe(false);
    expect(meetsRequirement(0, 4.5)).toBe(false);
  });

  it('境界値を正しく判定する', () => {
    expect(meetsRequirement(4.5, 4.5)).toBe(true);
    expect(meetsRequirement(4.49999, 4.5)).toBe(false);
  });
});

// ============================================================
// getJudgmentState
// ============================================================

describe('getJudgmentState', () => {
  it('検知結果がnullの場合、no-detectionを返す', () => {
    expect(getJudgmentState(null, '4.5', true)).toBe('no-detection');
    expect(getJudgmentState(null, '4.5', false)).toBe('no-detection');
  });

  it('基準値が無効な場合、exemptを返す', () => {
    const result = createDetectionResult({ ratio: 4.5 });
    expect(getJudgmentState(result, '免除', true)).toBe('exempt');
    expect(getJudgmentState(result, 'N/A', false)).toBe('exempt');
  });

  it('期待OKで検知もOKの場合、matchを返す', () => {
    const result = createDetectionResult({ ratio: 5.0 });
    expect(getJudgmentState(result, '4.5', true)).toBe('match');
  });

  it('期待NGで検知もNGの場合、matchを返す', () => {
    const result = createDetectionResult({ ratio: 3.0 });
    expect(getJudgmentState(result, '4.5', false)).toBe('match');
  });

  it('期待OKで検知NGの場合、mismatchを返す', () => {
    const result = createDetectionResult({ ratio: 3.0 });
    expect(getJudgmentState(result, '4.5', true)).toBe('mismatch');
  });

  it('期待NGで検知OKの場合、mismatchを返す', () => {
    const result = createDetectionResult({ ratio: 5.0 });
    expect(getJudgmentState(result, '4.5', false)).toBe('mismatch');
  });

  it('境界値で正しく判定する', () => {
    const resultExact = createDetectionResult({ ratio: 4.5 });
    expect(getJudgmentState(resultExact, '4.5', true)).toBe('match');

    const resultJustBelow = createDetectionResult({ ratio: 4.49 });
    expect(getJudgmentState(resultJustBelow, '4.5', true)).toBe('mismatch');
  });
});

// ============================================================
// stateToClass
// ============================================================

describe('stateToClass', () => {
  it('no-detectionに対して空文字を返す', () => {
    expect(stateToClass('no-detection')).toBe('');
  });

  it('exemptに対してborder-slate-200を返す', () => {
    expect(stateToClass('exempt')).toBe('border-slate-200');
  });

  it('matchに対してborder-green-400を返す', () => {
    expect(stateToClass('match')).toBe('border-green-400');
  });

  it('mismatchに対してborder-red-400を返す', () => {
    expect(stateToClass('mismatch')).toBe('border-red-400');
  });
});

// ============================================================
// BORDER_CLASSES
// ============================================================

describe('BORDER_CLASSES', () => {
  it('全ての状態に対応するクラスが定義されている', () => {
    expect(BORDER_CLASSES['no-detection']).toBeDefined();
    expect(BORDER_CLASSES['exempt']).toBeDefined();
    expect(BORDER_CLASSES['match']).toBeDefined();
    expect(BORDER_CLASSES['mismatch']).toBeDefined();
  });

  it('イミュータブルである（凍結されている）', () => {
    expect(Object.isFrozen(BORDER_CLASSES)).toBe(true);
  });
});

// ============================================================
// getCardBorderClass（統合テスト）
// ============================================================

describe('getCardBorderClass', () => {
  it('検知なしの場合、空文字を返す', () => {
    expect(getCardBorderClass(null, '4.5', true)).toBe('');
    expect(getCardBorderClass(null, '4.5', false)).toBe('');
  });

  it('免除の場合、border-slate-200を返す', () => {
    const result = createDetectionResult();
    expect(getCardBorderClass(result, '免除', true)).toBe('border-slate-200');
  });

  it('期待と検知が一致する場合、border-green-400を返す', () => {
    const resultOk = createDetectionResult({ ratio: 5.0 });
    expect(getCardBorderClass(resultOk, '4.5', true)).toBe('border-green-400');

    const resultNg = createDetectionResult({ ratio: 3.0 });
    expect(getCardBorderClass(resultNg, '4.5', false)).toBe('border-green-400');
  });

  it('期待と検知が不一致の場合、border-red-400を返す', () => {
    const resultOk = createDetectionResult({ ratio: 5.0 });
    expect(getCardBorderClass(resultOk, '4.5', false)).toBe('border-red-400');

    const resultNg = createDetectionResult({ ratio: 3.0 });
    expect(getCardBorderClass(resultNg, '4.5', true)).toBe('border-red-400');
  });

  it('基準3.0で正しく判定する', () => {
    const resultOk = createDetectionResult({ ratio: 3.5 });
    expect(getCardBorderClass(resultOk, '3.0', true)).toBe('border-green-400');

    const resultNg = createDetectionResult({ ratio: 2.5 });
    expect(getCardBorderClass(resultNg, '3.0', false)).toBe('border-green-400');
  });
});
