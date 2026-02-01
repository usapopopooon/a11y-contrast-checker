import { describe, it, expect } from 'vitest';
import { extractRingShadowFromBoxShadow } from './extractRingShadowFromBoxShadow';

describe('extractRingShadowFromBoxShadow', () => {
  it('リングシャドウパターン（0 0 0 Npx color）から色を抽出する', () => {
    expect(extractRingShadowFromBoxShadow('0 0 0 3px rgb(59, 130, 246)')).toBe(
      'rgb(59, 130, 246)'
    );
  });

  it('異なる幅のリングシャドウから色を抽出する', () => {
    expect(extractRingShadowFromBoxShadow('0 0 0 1px rgb(0, 0, 0)')).toBe(
      'rgb(0, 0, 0)'
    );
    expect(extractRingShadowFromBoxShadow('0 0 0 5px rgb(255, 0, 0)')).toBe(
      'rgb(255, 0, 0)'
    );
  });

  it('insetリングシャドウから色を抽出する', () => {
    expect(
      extractRingShadowFromBoxShadow('inset 0 0 0 2px rgba(0, 0, 255, 0.5)')
    ).toBe('rgba(0, 0, 255, 0.5)');
  });

  it('複数のシャドウからリングシャドウを見つける', () => {
    const multiShadow =
      '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 0 3px rgb(59, 130, 246)';
    expect(extractRingShadowFromBoxShadow(multiShadow)).toBe(
      'rgb(59, 130, 246)'
    );
  });

  it('リングパターンがない場合nullを返す', () => {
    expect(
      extractRingShadowFromBoxShadow('0 4px 6px rgba(0, 0, 0, 0.1)')
    ).toBeNull();
  });

  it('透明色のリングはnullを返す', () => {
    expect(
      extractRingShadowFromBoxShadow('0 0 0 3px rgba(0, 0, 0, 0)')
    ).toBeNull();
  });

  it('noneでnullを返す', () => {
    expect(extractRingShadowFromBoxShadow('none')).toBeNull();
  });

  it('空文字列でnullを返す', () => {
    expect(extractRingShadowFromBoxShadow('')).toBeNull();
  });
});
