import { describe, it, expect } from 'vitest';
import { stateToClass } from './stateToClass';

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
