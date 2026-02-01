import { describe, it, expect } from 'vitest';
import { detectViolations } from './detectViolations';

describe('detectViolations', () => {
  it('関数がエクスポートされている', () => {
    expect(typeof detectViolations).toBe('function');
  });

  it('オプションなしで呼び出せる', () => {
    const violations = detectViolations();
    expect(Array.isArray(violations)).toBe(true);
  });

  it('空のオプションで呼び出せる', () => {
    const violations = detectViolations({});
    expect(Array.isArray(violations)).toBe(true);
  });

  it('includeTextオプションを受け付ける', () => {
    const violations = detectViolations({ includeText: true });
    expect(Array.isArray(violations)).toBe(true);
  });

  it('includeUIオプションを受け付ける', () => {
    const violations = detectViolations({ includeUI: true });
    expect(Array.isArray(violations)).toBe(true);
  });
});
