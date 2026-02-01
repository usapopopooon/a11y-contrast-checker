import { describe, it, expect } from 'vitest';
import { DEFAULT_RETRY_CONFIG, PRIORITY_TYPE_MAPPINGS } from './constants';

describe('DEFAULT_RETRY_CONFIG', () => {
  it('デフォルト値が正しく設定されている', () => {
    expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(3);
    expect(DEFAULT_RETRY_CONFIG.initialDelay).toBe(100);
    expect(DEFAULT_RETRY_CONFIG.delayMultiplier).toBe(150);
  });

  it('イミュータブルである（凍結されている）', () => {
    expect(Object.isFrozen(DEFAULT_RETRY_CONFIG)).toBe(true);
  });
});

describe('PRIORITY_TYPE_MAPPINGS', () => {
  it('4つの優先モードマッピングがある', () => {
    expect(PRIORITY_TYPE_MAPPINGS.length).toBe(4);
  });

  it('detectFocusRingマッピングがある', () => {
    const mapping = PRIORITY_TYPE_MAPPINGS.find(
      (m) => m.option === 'detectFocusRing'
    );
    expect(mapping).toBeDefined();
    expect(mapping?.expectedType).toBe('focus-ring');
  });

  it('prioritizePlaceholderマッピングがある', () => {
    const mapping = PRIORITY_TYPE_MAPPINGS.find(
      (m) => m.option === 'prioritizePlaceholder'
    );
    expect(mapping).toBeDefined();
    expect(mapping?.expectedType).toBe('placeholder');
  });

  it('prioritizeBorderマッピングがある', () => {
    const mapping = PRIORITY_TYPE_MAPPINGS.find(
      (m) => m.option === 'prioritizeBorder'
    );
    expect(mapping).toBeDefined();
    expect(mapping?.expectedType).toBe('border');
  });

  it('prioritizeSvgマッピングがある', () => {
    const mapping = PRIORITY_TYPE_MAPPINGS.find(
      (m) => m.option === 'prioritizeSvg'
    );
    expect(mapping).toBeDefined();
    expect(mapping?.expectedType).toBe('svg');
  });

  it('イミュータブルである（凍結されている）', () => {
    expect(Object.isFrozen(PRIORITY_TYPE_MAPPINGS)).toBe(true);
  });
});
