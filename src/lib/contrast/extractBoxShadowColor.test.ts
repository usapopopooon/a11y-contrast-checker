import { describe, it, expect } from 'vitest';
import { extractBoxShadowColor } from './extractBoxShadowColor';

describe('extractBoxShadowColor', () => {
  it('box-shadowからrgba色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px rgba(0, 0, 0, 0.5)')).toBe(
      'rgba(0, 0, 0, 0.5)'
    );
  });

  it('box-shadowからrgb色を抽出する', () => {
    expect(extractBoxShadowColor('2px 2px 4px rgb(100, 100, 100)')).toBe(
      'rgb(100, 100, 100)'
    );
  });

  it('box-shadowからhex色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 10px #ff0000')).toBe('#ff0000');
    expect(extractBoxShadowColor('0 0 10px #f00')).toBe('#f00');
  });

  it('box-shadowからoklch色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px oklch(0.5 0.2 240)')).toBe(
      'oklch(0.5 0.2 240)'
    );
  });

  it('box-shadowからhsl色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px hsl(120, 100%, 50%)')).toBe(
      'hsl(120, 100%, 50%)'
    );
  });

  it('box-shadowからhsla色を抽出する', () => {
    expect(extractBoxShadowColor('0 0 5px hsla(120, 100%, 50%, 0.5)')).toBe(
      'hsla(120, 100%, 50%, 0.5)'
    );
  });

  it('insetシャドウから色を抽出する', () => {
    expect(extractBoxShadowColor('inset 0 0 5px rgb(255, 0, 0)')).toBe(
      'rgb(255, 0, 0)'
    );
  });

  it('noneでnullを返す', () => {
    expect(extractBoxShadowColor('none')).toBeNull();
  });

  it('空文字列でnullを返す', () => {
    expect(extractBoxShadowColor('')).toBeNull();
  });

  it('色情報のないシャドウでnullを返す', () => {
    expect(extractBoxShadowColor('0 0 5px')).toBeNull();
  });
});
