import { describe, it, expect } from 'vitest';
import { BORDER_CLASSES } from './constants';

describe('BORDER_CLASSES', () => {
  it('no-detectionに対して空文字が定義されている', () => {
    expect(BORDER_CLASSES['no-detection']).toBe('');
  });

  it('exemptに対してborder-slate-200が定義されている', () => {
    expect(BORDER_CLASSES['exempt']).toBe('border-slate-200');
  });

  it('matchに対してborder-green-400が定義されている', () => {
    expect(BORDER_CLASSES['match']).toBe('border-green-400');
  });

  it('mismatchに対してborder-red-400が定義されている', () => {
    expect(BORDER_CLASSES['mismatch']).toBe('border-red-400');
  });

  it('イミュータブルである（凍結されている）', () => {
    expect(Object.isFrozen(BORDER_CLASSES)).toBe(true);
  });

  it('4つの状態が定義されている', () => {
    expect(Object.keys(BORDER_CLASSES).length).toBe(4);
  });
});
