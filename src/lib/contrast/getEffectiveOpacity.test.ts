import { describe, it, expect } from 'vitest';
import { getEffectiveOpacity } from './getEffectiveOpacity';

describe('getEffectiveOpacity', () => {
  it('opacity 1の要素は1を返す', () => {
    const element = document.createElement('div');
    element.style.opacity = '1';
    document.body.appendChild(element);

    const opacity = getEffectiveOpacity(element);
    expect(opacity).toBe(1);

    document.body.removeChild(element);
  });

  it('opacity 0.5の要素は0.5を返す', () => {
    const element = document.createElement('div');
    element.style.opacity = '0.5';
    document.body.appendChild(element);

    const opacity = getEffectiveOpacity(element);
    expect(opacity).toBeCloseTo(0.5, 2);

    document.body.removeChild(element);
  });

  it('親のopacityを累積する', () => {
    const parent = document.createElement('div');
    parent.style.opacity = '0.5';
    const child = document.createElement('span');
    child.style.opacity = '0.5';
    parent.appendChild(child);
    document.body.appendChild(parent);

    const opacity = getEffectiveOpacity(child);
    expect(opacity).toBeCloseTo(0.25, 2);

    document.body.removeChild(parent);
  });

  it('opacity未設定の要素は1を返す', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const opacity = getEffectiveOpacity(element);
    expect(opacity).toBe(1);

    document.body.removeChild(element);
  });
});
