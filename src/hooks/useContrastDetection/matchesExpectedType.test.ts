import { describe, it, expect } from 'vitest';
import { matchesExpectedType } from './matchesExpectedType';
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

describe('matchesExpectedType', () => {
  it('期待するタイプがない場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'text' });
    expect(matchesExpectedType(result, {})).toBe(true);
  });

  it('タイプが一致する場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'focus-ring' });
    expect(matchesExpectedType(result, { detectFocusRing: true })).toBe(true);
  });

  it('タイプが一致しない場合、falseを返す', () => {
    const result = createDetectionResult({ type: 'text' });
    expect(matchesExpectedType(result, { detectFocusRing: true })).toBe(false);
  });

  it('placeholder優先でplaceholderタイプの場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'placeholder' });
    expect(matchesExpectedType(result, { prioritizePlaceholder: true })).toBe(
      true
    );
  });

  it('border優先でborderタイプの場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'border' });
    expect(matchesExpectedType(result, { prioritizeBorder: true })).toBe(true);
  });

  it('svg優先でsvgタイプの場合、trueを返す', () => {
    const result = createDetectionResult({ type: 'svg' });
    expect(matchesExpectedType(result, { prioritizeSvg: true })).toBe(true);
  });
});
