import { describe, it, expect } from 'vitest';
import { getGradientInfo } from './getGradientInfo';

describe('getGradientInfo', () => {
  it('グラデーション背景を検知する', () => {
    const element = document.createElement('div');
    element.style.backgroundImage = 'linear-gradient(to right, red, blue)';
    document.body.appendChild(element);

    const info = getGradientInfo(element);
    expect(info.isGradient).toBe(true);
    expect(info.colors.length).toBeGreaterThan(0);

    document.body.removeChild(element);
  });

  it('グラデーションがない場合falseを返す', () => {
    const element = document.createElement('div');
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const info = getGradientInfo(element);
    expect(info.isGradient).toBe(false);
    expect(info.colors).toEqual([]);

    document.body.removeChild(element);
  });

  it('親要素のグラデーションを検知する', () => {
    const parent = document.createElement('div');
    parent.style.backgroundImage = 'linear-gradient(to bottom, white, black)';
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    const info = getGradientInfo(child);
    expect(info.isGradient).toBe(true);

    document.body.removeChild(parent);
  });
});
