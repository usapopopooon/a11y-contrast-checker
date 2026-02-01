import { describe, it, expect } from 'vitest';
import { shouldRetry } from './shouldRetry';
import { DEFAULT_RETRY_CONFIG } from './constants';
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

describe('shouldRetry', () => {
  const config = DEFAULT_RETRY_CONFIG;

  it('リトライ回数が上限に達した場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'text', ratio: 1.0 });
    expect(shouldRetry(result, { detectFocusRing: true }, 3, config)).toBe(
      false
    );
  });

  it('優先モードがない場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'text', ratio: 1.0 });
    expect(shouldRetry(result, {}, 0, config)).toBe(false);
  });

  it('比率が無効な場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'focus-ring', ratio: 1.0 });
    expect(shouldRetry(result, { detectFocusRing: true }, 0, config)).toBe(
      true
    );
  });

  it('タイプが一致しない場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'text', ratio: 4.5 });
    expect(shouldRetry(result, { detectFocusRing: true }, 0, config)).toBe(
      true
    );
  });

  it('タイプが一致し比率も有効な場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'focus-ring', ratio: 4.5 });
    expect(shouldRetry(result, { detectFocusRing: true }, 0, config)).toBe(
      false
    );
  });

  it('リトライ回数が上限未満でもタイプ一致ならfalseを返す', () => {
    const result = createDetectionResult({ type: 'border', ratio: 3.0 });
    expect(shouldRetry(result, { prioritizeBorder: true }, 2, config)).toBe(
      false
    );
  });
});
