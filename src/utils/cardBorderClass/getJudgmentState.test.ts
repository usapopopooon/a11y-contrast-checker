import { describe, it, expect } from 'vitest';
import { getJudgmentState } from './getJudgmentState';
import type { DetectionResult } from '@/lib/contrast/index';

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
