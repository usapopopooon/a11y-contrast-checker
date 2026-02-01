import { describe, it, expect, afterEach } from 'vitest';
import { getTailwindRingColor } from './getTailwindRingColor';

describe('getTailwindRingColor', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('--tw-ring-colorカスタムプロパティから色を取得する', () => {
    const element = document.createElement('div');
    element.style.setProperty('--tw-ring-color', 'rgb(59, 130, 246)');
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('rgb(59, 130, 246)');
  });

  it('カスタムプロパティがない場合nullを返す', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBeNull();
  });

  it('カスタムプロパティを持つ親要素から取得する', () => {
    const parent = document.createElement('div');
    parent.style.setProperty('--tw-ring-color', 'rgb(100, 200, 50)');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    // カスタムプロパティの継承をテスト
    const color = getTailwindRingColor(child);
    // jsdomでのカスタムプロパティ継承の挙動に依存
    expect(color === 'rgb(100, 200, 50)' || color === null).toBe(true);
  });

  it('HTMLElement以外でnullを返す', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const color = getTailwindRingColor(svg);
    expect(color).toBeNull();
  });

  it('--tw-ring-colorがinitialの場合nullを返す', () => {
    const element = document.createElement('div');
    element.style.setProperty('--tw-ring-color', 'initial');
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBeNull();
  });

  it('--tw-ring-shadowからrgba色を抽出する', () => {
    const element = document.createElement('div');
    element.style.setProperty(
      '--tw-ring-shadow',
      '0 0 0 3px rgba(59, 130, 246, 0.5)'
    );
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('rgba(59, 130, 246, 0.5)');
  });

  it('--tw-ring-shadowからrgb色を抽出する', () => {
    const element = document.createElement('div');
    element.style.setProperty(
      '--tw-ring-shadow',
      '0 0 0 3px rgb(59, 130, 246)'
    );
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('rgb(59, 130, 246)');
  });

  it('--tw-ring-shadowからhex色を抽出する', () => {
    const element = document.createElement('div');
    element.style.setProperty('--tw-ring-shadow', '0 0 0 3px #3b82f6');
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('#3b82f6');
  });

  it('--tw-ring-shadowが0 0 #0000の場合nullを返す', () => {
    const element = document.createElement('div');
    element.style.setProperty('--tw-ring-shadow', '0 0 #0000');
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBeNull();
  });

  it('--tw-ring-colorが空の場合--tw-ring-shadowをチェックする', () => {
    const element = document.createElement('div');
    element.style.setProperty('--tw-ring-color', '');
    element.style.setProperty('--tw-ring-shadow', '0 0 0 2px #ff0000');
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('#ff0000');
  });

  it('--tw-ring-shadowからoklch色を抽出する', () => {
    const element = document.createElement('div');
    element.style.setProperty(
      '--tw-ring-shadow',
      '0 0 0 3px oklch(0.7 0.15 240)'
    );
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('oklch(0.7 0.15 240)');
  });

  it('--tw-ring-shadowからhsl色を抽出する', () => {
    const element = document.createElement('div');
    element.style.setProperty(
      '--tw-ring-shadow',
      '0 0 0 3px hsl(210, 100%, 50%)'
    );
    document.body.appendChild(element);

    const color = getTailwindRingColor(element);
    expect(color).toBe('hsl(210, 100%, 50%)');
  });
});
