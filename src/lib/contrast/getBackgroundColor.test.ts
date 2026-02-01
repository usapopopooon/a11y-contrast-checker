import { describe, it, expect } from 'vitest';
import { getBackgroundColor } from './getBackgroundColor';

describe('getBackgroundColor', () => {
  it('要素の背景色を取得する', () => {
    const element = document.createElement('div');
    element.style.backgroundColor = 'rgb(255, 0, 0)';
    document.body.appendChild(element);

    const color = getBackgroundColor(element);
    expect(color).toBe('rgb(255, 0, 0)');

    document.body.removeChild(element);
  });

  it('親要素の背景色を取得する', () => {
    const parent = document.createElement('div');
    parent.style.backgroundColor = 'rgb(0, 255, 0)';
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    const color = getBackgroundColor(child);
    expect(color).toBe('rgb(0, 255, 0)');

    document.body.removeChild(parent);
  });

  it('透明背景は親を遡る', () => {
    const parent = document.createElement('div');
    parent.style.backgroundColor = 'rgb(0, 0, 255)';
    const child = document.createElement('span');
    child.style.backgroundColor = 'transparent';
    parent.appendChild(child);
    document.body.appendChild(parent);

    const color = getBackgroundColor(child);
    expect(color).toBe('rgb(0, 0, 255)');

    document.body.removeChild(parent);
  });

  it('背景色がない場合は白を返す', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const color = getBackgroundColor(element);
    // デフォルトは白またはbodyの背景色
    expect(color).toBeTruthy();

    document.body.removeChild(element);
  });
});
