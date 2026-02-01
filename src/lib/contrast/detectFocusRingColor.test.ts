import { describe, it, expect } from 'vitest';
import { detectFocusRingColor } from './detectFocusRingColor';

describe('detectFocusRingColor', () => {
  it('outline色を検知する', () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(button);

    const result = detectFocusRingColor(button);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('outline');
    expect(result?.color).toBe('rgb(0, 0, 255)');

    document.body.removeChild(button);
  });

  it('box-shadow色を検知する', () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '0';
    button.style.boxShadow = '0 0 0 3px rgb(59, 130, 246)';
    document.body.appendChild(button);

    const result = detectFocusRingColor(button);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('box-shadow');

    document.body.removeChild(button);
  });

  it('HTMLElement以外でnullを返す', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const result = detectFocusRingColor(svg);
    expect(result).toBeNull();
  });

  it('input要素のoutlineを検知する', () => {
    const input = document.createElement('input');
    input.style.outlineWidth = '3px';
    input.style.outlineStyle = 'solid';
    input.style.outlineColor = 'rgb(0, 128, 0)';
    document.body.appendChild(input);

    const result = detectFocusRingColor(input);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('outline');
    expect(result?.color).toBe('rgb(0, 128, 0)');

    document.body.removeChild(input);
  });
});
