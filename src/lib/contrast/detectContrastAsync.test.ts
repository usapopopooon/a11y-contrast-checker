import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectContrastAsync } from './detectContrastAsync';

describe('detectContrastAsync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('非同期でコントラストを検知する', async () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const promise = detectContrastAsync(element);

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.ratio).toBeCloseTo(21, 0);
  });

  it('オプションを渡して非同期検知する', async () => {
    const element = document.createElement('div');
    element.style.borderWidth = '2px';
    element.style.borderStyle = 'solid';
    element.style.borderColor = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const promise = detectContrastAsync(element, { prioritizeBorder: true });

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.type).toBe('border');
  });

  it('SVG優先モードで非同期検知する', async () => {
    const container = document.createElement('div');
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'rgb(0, 0, 0)';
    container.appendChild(svg);
    document.body.appendChild(container);

    const promise = detectContrastAsync(container, { prioritizeSvg: true });

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');
  });

  it('空のオプションで非同期検知する', async () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const promise = detectContrastAsync(element, {});

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.type).toBe('text');
  });

  it('リンク要素を非同期検知する', async () => {
    const link = document.createElement('a');
    link.style.color = 'rgb(0, 0, 255)';
    link.style.textDecorationLine = 'underline';
    link.href = '#';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(link);

    const promise = detectContrastAsync(link);

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.type).toBe('link');
    expect(result.hasUnderline).toBe(true);
  });

  it('下線なしリンク要素を非同期検知する', async () => {
    const parent = document.createElement('p');
    parent.style.color = 'rgb(0, 0, 0)';
    const link = document.createElement('a');
    link.style.color = 'rgb(0, 0, 255)';
    link.style.textDecorationLine = 'none';
    link.href = '#';
    parent.appendChild(link);
    document.body.appendChild(parent);

    const promise = detectContrastAsync(link);

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.type).toBe('link-no-underline');
    expect(result.hasUnderline).toBe(false);
  });

  it('ボーダーをフォールバックとして非同期検知する', async () => {
    const element = document.createElement('div');
    element.style.color = 'transparent';
    element.style.borderWidth = '2px';
    element.style.borderStyle = 'solid';
    element.style.borderColor = 'rgb(100, 100, 100)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const promise = detectContrastAsync(element);

    await vi.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(result.detected).toBe(true);
    expect(result.type).toBe('border');
  });
});
