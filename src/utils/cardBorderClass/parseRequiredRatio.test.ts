import { describe, it, expect } from 'vitest';
import { parseRequiredRatio } from './parseRequiredRatio';

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

  it('整数文字列をパースする', () => {
    expect(parseRequiredRatio('1')).toBe(1);
    expect(parseRequiredRatio('10')).toBe(10);
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

  it('負の数をパースする', () => {
    expect(parseRequiredRatio('-1')).toBe(-1);
  });
});
