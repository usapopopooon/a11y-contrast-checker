import { describe, it, expect } from 'vitest';
import { isValidColor } from './isValidColor';

describe('isValidColor', () => {
  it('有効なrgb色文字列でtrueを返す', () => {
    expect(isValidColor('rgb(0, 0, 0)')).toBe(true);
    expect(isValidColor('rgb(255, 255, 255)')).toBe(true);
    expect(isValidColor('rgb(128, 128, 128)')).toBe(true);
  });

  it('有効なrgba色文字列でtrueを返す', () => {
    expect(isValidColor('rgba(255, 255, 255, 1)')).toBe(true);
    expect(isValidColor('rgba(0, 0, 0, 0.5)')).toBe(true);
  });

  it('有効なhex色文字列でtrueを返す', () => {
    expect(isValidColor('#000000')).toBe(true);
    expect(isValidColor('#fff')).toBe(true);
    expect(isValidColor('#FF0000')).toBe(true);
  });

  it('有効な名前付き色でtrueを返す', () => {
    expect(isValidColor('red')).toBe(true);
    expect(isValidColor('blue')).toBe(true);
    expect(isValidColor('white')).toBe(true);
  });

  it('nullでfalseを返す', () => {
    expect(isValidColor(null)).toBe(false);
  });

  it('undefinedでfalseを返す', () => {
    expect(isValidColor(undefined)).toBe(false);
  });

  it('空文字列でfalseを返す', () => {
    expect(isValidColor('')).toBe(false);
  });

  it('完全透明のrgba色でfalseを返す', () => {
    expect(isValidColor('rgba(0, 0, 0, 0)')).toBe(false);
  });

  it('transparentでfalseを返す', () => {
    expect(isValidColor('transparent')).toBe(false);
  });

  it('noneでfalseを返す', () => {
    expect(isValidColor('none')).toBe(false);
  });
});
