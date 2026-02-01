import { describe, it, expect } from 'vitest';
import { checkWcagAA } from './checkWcagAA';

describe('checkWcagAA', () => {
  it('通常テキストで4.5:1以上はAA合格', () => {
    const result = checkWcagAA(4.5, '16px', 'normal');
    expect(result.meetsAA).toBe(true);
    expect(result.required).toBe(4.5);
    expect(result.isLargeText).toBe(false);
  });

  it('通常テキストで4.5:1未満はAA不合格', () => {
    const result = checkWcagAA(4.4, '16px', 'normal');
    expect(result.meetsAA).toBe(false);
    expect(result.required).toBe(4.5);
  });

  it('大きいテキストで3.0:1以上はAA合格', () => {
    const result = checkWcagAA(3.0, '24px', 'normal');
    expect(result.meetsAA).toBe(true);
    expect(result.required).toBe(3.0);
    expect(result.isLargeText).toBe(true);
  });

  it('大きいテキストで3.0:1未満はAA不合格', () => {
    const result = checkWcagAA(2.9, '24px', 'normal');
    expect(result.meetsAA).toBe(false);
    expect(result.required).toBe(3.0);
  });

  it('weight 700で19pxは大きいテキスト', () => {
    const result = checkWcagAA(3.5, '19px', '700');
    expect(result.isLargeText).toBe(true);
    expect(result.required).toBe(3.0);
    expect(result.meetsAA).toBe(true);
  });

  it('ratioを正しく返す', () => {
    const result = checkWcagAA(5.5, '16px', 'normal');
    expect(result.ratio).toBe(5.5);
  });
});
