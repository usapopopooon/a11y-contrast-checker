import { describe, it, expect } from 'vitest';
import { getColorAlpha } from './getColorAlpha';

describe('getColorAlpha', () => {
  it('rgba色のアルファ値を取得する', () => {
    expect(getColorAlpha('rgba(0, 0, 0, 0.5)')).toBe(0.5);
  });

  it('完全透明のアルファ値を取得する', () => {
    expect(getColorAlpha('rgba(0, 0, 0, 0)')).toBe(0);
  });

  it('完全不透明のアルファ値を取得する', () => {
    expect(getColorAlpha('rgba(255, 255, 255, 1)')).toBe(1);
  });

  it('rgb色はアルファ1を返す', () => {
    expect(getColorAlpha('rgb(0, 0, 0)')).toBe(1);
    expect(getColorAlpha('rgb(255, 255, 255)')).toBe(1);
  });

  it('パーセントアルファを処理する', () => {
    expect(getColorAlpha('rgba(0, 0, 0, 50%)')).toBe(0.5);
  });

  it('0.75のアルファを取得する', () => {
    expect(getColorAlpha('rgba(100, 100, 100, 0.75)')).toBe(0.75);
  });
});
